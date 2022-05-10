const axios = require("axios");
class GamesApi {
    constructor(
      baseURL = "https://www.freetogame.com/api/",
      API_KEY = process.env.API_KEY,
      API_USER = process.env.API_USER
    ) {
      this.API_KEY = API_KEY; // || "https://ih-crud-api.herokuapp.com";
      this.API_USER = API_USER; // || "default key";
      this.baseURL = baseURL; // || " dafalut user";
      this.api = axios.create({ baseURL: this.baseURL }); // Typocal connection string requires keys etc... `${this.baseURL}/?key=${API_KEY}`
    }
    getAllGames = () => this.api.get("/games").then(response=>response.data)
    getOneGame = (gameId) => this.api.get(`/game?id=game${gameId}`).then(response=>response.data)
    getGameByGenre = (genre) => this.api.get(`/games?category=${genre}`).then(response=>response.data)
  }

  
module.exports = GamesApi;