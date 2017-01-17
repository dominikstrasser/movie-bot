const {Wit, log, interactive} = require('node-wit');
const imdb = require('imdb-api');

const WIT_TOKEN = process.env.WIT_TOKEN;

export class WitController {

  private client;
  private messageCallback;

  constructor() {
    this.initClient();
  }

  private initClient() {

    const actions = this.getActions();

    this.client = new Wit({
      accessToken: WIT_TOKEN,
      actions: actions
    });

  }

  private getActions() {
    return {
      send: this.sendAction.bind(this),
      searchMovie: this.searchMovieAction.bind(this)
    }
  }

  private sendAction(request, response) {
    const {text, quickreplies} = response;
    return Promise.resolve(this.messageCallback(response.text));
  }

  private searchMovieAction({sessionId, context, text, entities}) {

    return new Promise((resolve, reject) => {
      imdb.getReq({ name: text }, (err, result) => {
        let con: any = {};
        if (err) {
          con.movieNotFound = true;
          return resolve(con)
        } else {
          con.movie = result.title;
          con.plot = result.plot;
          return resolve(con);
        }
      })
    })

  }


  public sendMessage(text, callBackFn) {

    this.messageCallback = callBackFn;

    this.client.runActions('test-123', text, {})
      .catch(console.error);
  }

}