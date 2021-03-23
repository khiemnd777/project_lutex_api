const { sanitizeEntity } = require("strapi-utils");
const slugify = require("slugify");

const random = (list) => {
  return list[Math.floor(Math.random() * list.length)];
};

const toSanitizedModels = (list, model) => {
  return list.map((entity) => toSanitizedModel(entity, model));
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

const mergeObjects = (target, source, base) => {
  const baseSource = base || source;
  for (const key in baseSource) {
    if (source[key] instanceof Object) {
      mergeObjects(target[key] || {}, source[key]);
      continue;
    }
    if ("object" !== typeof source[key] && !!source[key]) {
      target[key] = source[key];
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

module.exports = {
  random,
  toSanitizedModel,
  toSanitizedModels,
  shuffleArray,
  toSeoModel,
  slugifyUtils,
  displayNameUtils,
  googlePhotofy,
  testGooglePhotofy,
  propifyGooglePhoto,
  mergeObjects,
};
