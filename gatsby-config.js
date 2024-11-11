// gatsby-config.js
module.exports = {
  plugins: [
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Solace Context Mesh`,
        short_name: `SolaceAI`,
        start_url: `/`,
        display: `standalone`,
        icon: `src/images/favicon.ico`,
      },
    },
  ],
};
