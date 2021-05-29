#addin nuget:?package=Cake.FileHelpers&version=4.0.1
#addin nuget:?package=Cake.Yarn&version=0.4.8
#addin nuget:?package=Cake.Npm&version=1.0.0

var target = Argument("target", "Default");

var root = "./../../../";
var rootBuild = "./../";
// PM2 config
var pm2Config = "pm2.config.js";
var pm2ConfigPath = $"{root}{pm2Config}";
var pm2ConfigTemplate = $"{pm2Config}.template";
var pm2ConfigTemplatePath = $"{rootBuild}{pm2ConfigTemplate}";
// Server.js
var serverRun = "server.js";
var serverRunPath = $"{root}{serverRun}";
var serverRunTemplate = $"{serverRun}.template";
var serverRunTemplatePath = $"{rootBuild}{serverRunTemplate}";

Task ("Clean")
  .Does (() =>
  {
    // Delete pm2 configuration file.
    if (FileExists (pm2ConfigPath))
    {
      Console.WriteLine ("Delete pm2 configuration file.");
      DeleteFile (pm2ConfigPath);
    }
    // Delete server.js
    if (FileExists (serverRunPath))
    {
      Console.WriteLine ("Delete server run file.");
      DeleteFile (serverRunPath);
    }
  });

Task ("Copy-FS")
  .Does (() =>
  {
    // Copy server.js
    if (FileExists (serverRunTemplatePath))
    {
      Console.WriteLine ("Copy run-server file.");
      CopyFile (serverRunTemplatePath, serverRunPath);
    }

    // Copy pm2 configuration file.
    if (FileExists (pm2ConfigTemplatePath))
    {
      Console.WriteLine ("Copy pm2 configuration file.");
      var pm2TemplateRead = FileReadText (pm2ConfigTemplatePath);
      // Replace tokens
      TransformText (pm2TemplateRead, "{{", "}}")
        .WithToken ("PM2_NAME", "resume-server")
        .WithToken ("PM2_SCRIPT", "./server.js")
        .Save (pm2ConfigPath);
    }
  });

Task ("Build")
  .Does (() =>
  {
    // Yarn install & build
    Yarn
      .Add (settings => settings.Package ("pm2").Globally ())
      .Install ()
      .RunScript ("build")
      .RunScript ("stop:pm2")
      .RunScript ("start:pm2");
  });

Task ("PM2-Delete")
  .Does(() => {
    Yarn.Add(settings => settings.Package("pm2").Globally())
      .RunScript("delete:pm2");
  });

Task ("PM2-Stop")
  .Does(() => {
    Yarn.Add (settings => settings.Package ("pm2").Globally ())
      .RunScript("stop:pm2");
  });

Task ("PM2-Start")
  .Does(() => {
    Yarn.Add (settings => settings.Package ("pm2").Globally ())
      .RunScript("start:pm2");
  });

Task ("PM2-Not-Exists")
  .Does (() =>
  {

  });

Task ("Default")
  .IsDependentOn ("Clean")
  .IsDependentOn ("Copy-FS")
  .IsDependentOn ("Build")
  .Does (() =>
  {

  });

RunTarget (target);
