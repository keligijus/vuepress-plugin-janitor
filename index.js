const fs = require('fs');

module.exports = (options, ctx) => {
  return {
    name: 'vuepress-plugin-janitor',

    generated() {
      ctx.pages.map((page) => {
        const currentDateUTC = new Date().toUTCString();
        const currentDateISO = new Date(currentDateUTC).toISOString();

        if (page.frontmatter.date) {
          const currentDate = new Date(currentDateISO);
          const pageDate = new Date(page.frontmatter.date);

          const isFuturePost = pageDate > currentDate;

          if (isFuturePost) {
            deleteFolderRecursive(ctx.outDir + page.path);
            // fs.unlinkSync();

            console.log(
              `♻️ Future Post: ${page.frontmatter.title} was removed from the build directory.`
            );
          }
        }
      });
    },
  };
};

const deleteFolderRecursive = (path) => {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach((file) => {
      const currentPath = `${path}/${file}`;

      fs.lstatSync(currentPath).isDirectory()
        ? deleteFolderRecursive(currentPath)
        : fs.unlinkSync(currentPath);
    });

    fs.rmdirSync(path);
  }
};
