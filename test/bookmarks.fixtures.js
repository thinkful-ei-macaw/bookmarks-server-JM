function makeBookmarksArray() {
  return [
    {
      id: 1,
      title: 'Google',
      url: 'https://google.com',
      description: 'Search for stuff',
      rating: 5
    },
    {
      id: 2,
      title: 'Facebook',
      url: 'https://facebook.com',
      description: 'Poke people',
      rating: 4
    },
    {
      id: 3,
      title: 'CSS Legends',
      url: 'https://css-legends.com',
      rating: 5
    }
  ];
}

module.exports = { makeBookmarksArray };