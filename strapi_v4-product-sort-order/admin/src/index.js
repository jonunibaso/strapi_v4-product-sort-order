import pluginPkg from "../../package.json";

const pluginId = pluginPkg.strapi.name;
const pluginName = pluginPkg.strapi.displayName || pluginId;

export default {
  register(app) {
    app.registerPlugin({ id: pluginId, name: pluginName });

    app.addMenuLink({
      to: `/plugins/${pluginId}`,
      icon: () => "↕️",
      intlLabel: { id: `${pluginId}.plugin.name`, defaultMessage: pluginName },
      Component: async () => {
        const component = await import("./pages/App");
        return component;
      },
      permissions: [],
    });
  },
};
