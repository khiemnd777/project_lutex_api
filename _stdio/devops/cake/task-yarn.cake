#load "constants.cake"

Task("Yarn-Install")
  .Does(() => {
    Yarn.Install();
  });
  