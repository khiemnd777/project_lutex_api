#load "inject.cake"
#load "file-path.cake"
#load "utilities.cake"
#load "task-config.cake"
#load "task-fs.cake"
#load "task-git.cake"
#load "task-yarn.cake"
#load "task-pm2.cake"

Setup(context =>
{
  var config = TaskConfiguration.GetConfig(Context);
  Information("Building with {0} environment and {1} mode.", config.Environment, config.Configuration);      
});

Teardown(context => {
  var config = TaskConfiguration.GetConfig(Context);
  Information("Built with {0} environment and {1} mode.", config.Environment, config.Configuration);
});

// Build
Task ("Build")
  .Does (() =>
  {
    var config = TaskConfiguration.GetConfig(Context);
    Yarn.RunScript (config.Configuration == "debug" ? "build" : IsRunningOnWindows() ? "build:prod:win" : "build:prod");
  });

// Run
Task ("Run")
  .Does (() =>
  {
    var config = TaskConfiguration.GetConfig(Context);
    if(config.Environment == "development"){
      Yarn.RunScript (config.Configuration == "debug" ? "develop" : IsRunningOnWindows() ? "develop:prod:win" : "develop:prod");
    } else {
      Yarn.RunScript (config.Configuration == "debug" ? "start" : IsRunningOnWindows() ? "start:prod:win" : "start:prod");
    }
  });

var config = TaskConfiguration.GetConfig(Context);
var envMode = config.Environment;
var target = Argument("target", "Default");

// Rollback
var rollbackTask = Task("Rollback");
if(envMode == "development") {
  rollbackTask
    .IsDependentOn("Clean")
    .Does(() => {

    });
} else {
  rollbackTask
    .IsDependentOn("PM2-Init")
    .IsDependentOn("PM2-Stop")
    .IsDependentOn("PM2-Delete")
    .IsDependentOn("Clean")
    .Does(() => {

    });
}

// Default task
var defaultTask = Task ("Default");
if (envMode == "development") {
  defaultTask
    .IsDependentOn ("Clean")
    .IsDependentOn ("Copy-FS")
    .IsDependentOn ("Git-Checkout")
    .IsDependentOn ("Git-Pull")
    .IsDependentOn ("Yarn-Init")
    .IsDependentOn ("Yarn-Install")
    .IsDependentOn ("Build")
    .Does (() =>
    {
      Information("Built with {0} environment.", envMode);
    });
} else {
  defaultTask
    .IsDependentOn ("Clean")
    .IsDependentOn ("Copy-FS")
    .IsDependentOn ("Yarn-Init")
    .IsDependentOn ("PM2-Init")
    .IsDependentOn ("PM2-Stop")
    .IsDependentOn ("Git-Checkout")
    .IsDependentOn ("Git-Pull")
    .IsDependentOn ("Yarn-Install")
    .IsDependentOn ("Build")
    .IsDependentOn ("PM2-Start")
    .Does (() =>
    {
      Information("Built with {0} environment.", envMode);
    });
}
defaultTask
  .OnError(exception =>
  {
    RunTarget("Rollback");
  });

RunTarget (target);
