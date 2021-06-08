#load "file-path.cake"

using Cake.Core;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

public class TaskConfigurationModel 
{
  [JsonProperty("CONFIGURATION")]
  public string Configuration { get; set; }
  [JsonProperty("ENVIRONMENT")]
  public string Environment { get; set; }
  [JsonProperty("PM2_NAME")]
  public string Pm2Name { get; set; }
  [JsonProperty("PM2_SCRIPT")]
  public string Pm2Script { get; set; }
  [JsonProperty("HOST")]
  public string Host { get; set; }
  [JsonProperty("PORT")]
  public int? Port { get; set; }
  [JsonProperty("CLOUDINARY_NAME")]
  public string CloudinaryName { get; set; }
  [JsonProperty("CLOUDINARY_KEY")]
  public string CloudinaryKey { get; set; }
  [JsonProperty("CLOUDINARY_SECRET")]
  public string CloudinarySecret { get; set; }
  [JsonProperty("REDIS_URL")]
  public string RedisUrl { get; set; }
  [JsonProperty("CRON_ENABLED")]
  public bool? CronEnabled { get; set; }
  [JsonProperty("DATABASE_HOST")]
  public string DatabaseHost { get; set; }
  [JsonProperty("DATABASE_SRV")]
  public bool? DatabaseSrv { get; set; }
  [JsonProperty("DATABASE_PORT")]
  public int? DatabasePort { get; set; }
  [JsonProperty("DATABASE_NAME")]
  public string DatabaseName { get; set; }
  [JsonProperty("DATABASE_USERNAME")]
  public string DatabaseUserName { get; set; }
  [JsonProperty("DATABASE_PASSWORD")]
  public string DatabasePassword { get; set; }
  [JsonProperty("AUTHENTICATION_DATABASE")]
  public string AuthenticationDatabase { get; set; }
  [JsonProperty("GIT_PROVIDER")]
  public string GitProvider { get; set; }
  [JsonProperty("GIT_BRANCH")]
  public string GitBranch { get; set; }
  [JsonProperty("GIT_MERGER_NAME")]
  public string GitMergerName { get; set; }
  [JsonProperty("GIT_MERGER_EMAIL")]
  public string GitMergerEmail { get; set; }
  [JsonProperty("GIT_USERNAME")]
  public string GitUserName { get; set; }
  [JsonProperty("GIT_PASSWORD")]
  public string GitPassword { get; set; }
  [JsonProperty("GIT_REMOTE")]
  public string GitRemote { get; set; }
}

public static class TaskConfiguration 
{
  public static object _objectLock  = new object();

  private static TaskConfigurationModel _config;

  public static TaskConfigurationModel GetConfig (ICakeContext context) 
  {
    if(_config != null) return _config;
    lock(_objectLock)
    {
      var configBuildPath = new FilePath("build.config.json");
      _config = context.DeserializeJsonFromFile<TaskConfigurationModel>(configBuildPath.Path);
      return _config;
    }
  }

  public static JObject ToToken(ICakeContext context) {
    if(_config != null) 
    {
      return JObject.FromObject(_config);
    }
    return null;
  }
}
