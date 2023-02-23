// const { default: chalk } = require("chalk");
var colors = require("colors");

colors.enable();
module.exports = {
  showBanner: (runningFeatures, loginConfirmation) => {
    let banner = `
        ==================================================
                       🤖 vPET DPD API 🤖
                       > version: 1.0.0 <
                        > author: kyeZ <
                 > https://github.com/thekyeZ <
        ==================================================
    `;

    console.log(banner);
  },
};
