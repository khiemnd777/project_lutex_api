const BootstrapFactory = require("./bootstrap-factory");
const Bootstrapper = require("./bootstrapper");

class SetPermissionBootstrapper extends Bootstrapper {
  async findPublicRole() {
    return await strapi
      .query("role", "users-permissions")
      .findOne({ type: "public" });
  }
  async findAuthenticatedRole() {
    return await strapi
      .query("role", "users-permissions")
      .findOne({ type: "authenticated" });
  }
  async findPublicPermissions() {
    const role = await this.findPublicRole();
    return await strapi.query("permission", "users-permissions").find({
      type: "application",
      role: role.id,
      _where: [
        { action_ne: "update" },
        { action_ne: "create" },
        { action_ne: "delete" },
        { action_ne: "createlocalization" },
        { action_ne: "setup" },
        { action_ne: "upgrade" },
        { action_ne: "uninstall" },
      ],
    });
  }
  async findAuthenticatedPermissions() {
    const role = await this.findAuthenticatedRole();
    return await strapi.query("permission", "users-permissions").find({
      type: "application",
      role: role.id,
    });
  }
  async updatePermissions(permissions) {
    await Promise.all(
      permissions.map((p) =>
        strapi
          .query("permission", "users-permissions")
          .update({ id: p.id }, { enabled: true })
      )
    );
  }
  async allowToSetDefaultPermissions() {
    let env = await strapi.query("environment").findOne();
    if (!env) {
      await strapi.query("environment").create({ SetDefaultPermissions: true });
      env = await strapi.query("environment").findOne();
    }
    return env.SetDefaultPermissions;
  }
  async resetAllowingDefaultPermissions() {
    const env = await strapi.query("environment").findOne();
    if (env) {
      await strapi
        .query("environment")
        .update({ id: env.id }, { SetDefaultPermissions: false });
    }
  }
  async Run() {
    const allowing = await this.allowToSetDefaultPermissions();
    if (allowing) {
      strapi.log.info("Set permission bootstrapper");
      // public
      const publicPermissions = await this.findPublicPermissions();
      await this.updatePermissions(publicPermissions);
      // authenticated
      const authenticatedPermissions =
        await this.findAuthenticatedPermissions();
      await this.updatePermissions(authenticatedPermissions);
    }
    await this.resetAllowingDefaultPermissions();
  }
}

BootstrapFactory.Register(new SetPermissionBootstrapper());
