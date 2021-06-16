const { sanitizeEntity } = require("strapi-utils");
const slugify = require("slugify");

const random = (list) => {
  return list[Math.floor(Math.random() * list.length)];
};

const toSanitizedModels = (list, model) => {
  if (list && Array.isArray(list)) {
    return list.map((entity) => toSanitizedModel(entity, model));
  }
  return list;
};

const toSanitizedModel = (entity, model) => {
  return sanitizeEntity(entity, { model: model });
};

const shuffleArray = (arr) => {
  return arr.reduce(
    (newArr, _, i) => {
      var rand = i + Math.floor(Math.random() * (newArr.length - i));
      [newArr[rand], newArr[i]] = [newArr[i], newArr[rand]];
      return newArr;
    },
    [...arr]
  );
};

const isArray = (arr) => {
  return !!arr && Array.isArray(arr);
};

const arraySize = (arr) => {
  return isArray(arr) ? arr.length : 0;
};

const mergeObjects = (target, source, base) => {
  const baseSource = base || source;
  for (const key in baseSource) {
    if (
      "object" !== typeof source[key] &&
      "function" !== typeof source[key] &&
      !!source[key]
    ) {
      target[key] = source[key];
    }
    if ("function" === typeof source[key]) {
      target[key] = source[key];
    }
    if (source[key] instanceof Object && "function" !== typeof source[key]) {
      target[key] = mergeObjects({}, source[key]);
    }
  }
  return target;
};

const toSeoModel = (entity, mapFrom) => {
  if (!entity) return null;
  let baseSource = {
    title: "",
    description: "",
    type: "",
    url: "",
    image: "",
  };
  let target = mergeObjects({}, entity, baseSource);
  if (!!mapFrom) {
    target = mergeObjects(target, mapFrom);
  }
  return target;
};

const slugifyUtils = (data, prop, slugProp) => {
  var slug = slugProp ? slugProp : "Slug";
  if (!data[slug] && !!data[prop]) {
    var slugVal = slugify(data[prop], { lower: true });
    slugVal = slugVal.replace(/[\._\-]+$/g, "");
    slugVal = slugVal.replace("'s", "");
    slugVal = slugVal.replace("'", "");
    slugVal = slugVal.replace(".", "-");
    data[slug] = slugVal;
  }
};

const displayNameUtils = (data, prop, displayNameProp) => {
  var displayName = displayNameProp ? displayNameProp : "DisplayName";
  if (!data[displayName] && !!data[prop]) {
    var displayNameVal = data[prop]
      .replace(/(_|-)/g, " ")
      .trim()
      .replace(/\w\S*/g, function (str) {
        return str.charAt(0) + str.substr(1);
      })
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/([A-Z])([A-Z][a-z])/g, "$1 $2");
    data[displayName] = displayNameVal;
  }
};

const googlePhotofy = (shareableLink) => {
  const pattern = /(?<=drive\.google\.com\/file\/d\/)(.*)(?=\/)/gi;
  const result = shareableLink.match(pattern);
  if (!!result) {
    return `https://drive.google.com/uc?export=view&id=${result}`;
  }
  return null;
};

const testGooglePhotofy = (shareableLink) => {
  const pattern = /(?<=drive\.google\.com\/file\/d\/)(.*)(?=\/)/gi;
  return pattern.test(shareableLink);
};

const propifyGooglePhoto = (data, prop) => {
  if (testGooglePhotofy(data[prop])) {
    data[prop] = googlePhotofy(data[prop]);
  }
};

const seo = async (entityName, filter, populate) => {
  return await strapi.services[entityName].find(filter, populate);
};

const seoCollection = async (entityName, filter, populate) => {
  const entities = await seo(entityName, filter, populate);
  return entities ? entities[0] && entities[0].Seo : null;
};

const seoSingle = async (entityName, filter, populate) => {
  const entity = await seo(entityName, filter, populate);
  return entity ? entity.Seo : null;
};

const find = async (entityName, filter, populate) => {
  return await strapi.services[entityName].find(filter, populate);
};

const firstOrDefault = async (entityName, filter, populate) => {
  const entity = await find(entityName, filter, populate);
  if (entity) {
    if (isArray(entity)) {
      return entity[0];
    }
    return entity;
  }
  return null;
};

const generateTokenizedKey = (builtKey, token) => {
  let indicatedKey = builtKey;
  for (const key in token) {
    indicatedKey += `[${key}]`;
    indicatedKey += generateTokenizedKey(indicatedKey, token[key]);
  }
  return indicatedKey;
};

const toTokenizedObject = (tokenizedData) => {
  const result = {};
  if (isArray(tokenizedData)) {
    tokenizedData.forEach((token) => {
      for (const key in token) {
        let builtKey = key;
        const tokenizedValue = token[key];
        // if is array
        if (isArray(tokenizedValue)) {
          for (let inx = 0; inx < tokenizedValue.length; inx++) {
            builtKey += `[${inx}]`;
          }
          continue;
        }
        // if is object
        if ("object" === typeof tokenizedValue) {
          continue;
        }
        // the other ways.
      }
    });
  }
  return null;
};

const cloneObject = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

const parseBody = (body) => {
  if (!body) return null;
  return JSON.parse(body);
};

module.exports = {
  random,
  toSanitizedModel,
  toSanitizedModels,
  shuffleArray,
  isArray,
  arraySize,
  toSeoModel,
  slugifyUtils,
  displayNameUtils,
  googlePhotofy,
  testGooglePhotofy,
  propifyGooglePhoto,
  mergeObjects,
  seoCollection,
  seoSingle,
  find,
  firstOrDefault,
  parseBody,
  cloneObject,
};
