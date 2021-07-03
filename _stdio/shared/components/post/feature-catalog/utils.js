const { isArray } = require('../../../utils');

const syncFeaturedCatalogWithEmptyFields = async (featuredCatalogs) => {
  if(isArray(featuredCatalogs)){
    await Promise.all(featuredCatalogs.map(async (fc) => {
      if(!fc.Title || !fc.Router){
        if(fc.Catalog){
          const postCatalog = await strapi.query("post-catalogs").findOne({id:fc.Catalog});
          if(postCatalog){
            if(!fc.Title){
              if(postCatalog.DisplayName){
                fc.Title = postCatalog.DisplayName;
              }
            }
            if(!fc.Router){
              if(postCatalog.Router){
                fc.Router = postCatalog.Router.id;
              }
            }
          }
        }
      }
    }));
  }
}

module.exports = {
  syncFeaturedCatalogWithEmptyFields
}