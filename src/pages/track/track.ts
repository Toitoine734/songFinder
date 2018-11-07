import {Component} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {HttpHeaders} from '@angular/common/http';
import {NavController, NavParams} from "ionic-angular";
import {xml2json} from "xml-js";
import {HomePage} from '../home/home';

@Component({
  templateUrl: 'track.html'
})
export class TrackPage {

  spotifyTrack = [];

  constructor(public http: HttpClient, public navParams: NavParams , public navCtrl: NavController) {
    this.spotifyTrack = navParams.get('track');
    this.GlobalSearch().then((data: any) => {
      this.spotifyTrack['externes_url'] = data;
    });
  }

  async ItunesSearch() {;
    return new Promise((resolve, reject) => {
      this.http.get('https://itunes.apple.com/search?term=' + this.spotifyTrack['name'] + '+' + this.spotifyTrack['artist'])
        .subscribe(
          data => {
            resolve(data);
          },
          err => {
            reject('Error Search');
          });
    });
  }

  async YoutubeSearch() {;

    let youtubeToken = 'AIzaSyCvEZh-oz8CBw06u_-LNsujRRJMzbOK0iM'

    return new Promise((resolve, reject) => {
      this.http.get('https://www.googleapis.com/youtube/v3/search?part=snippet&q=' + this.spotifyTrack['name'] + '+' + this.spotifyTrack['artist'] + '&type=video&key=' + youtubeToken)
        .subscribe(
          data => {
            resolve(data);
          },
          err => {
            reject('Error Search');
          });
    });
  }

  async DeezerSearch() {;
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders({
          'Accept': 'text',
          'Content-Type': 'text',
        });

      this.http.get('deezer/search/?q=' + this.spotifyTrack['name'] + '+' + this.spotifyTrack['artist'] + '&output=xml', {headers: headers, responseType: 'text'})
        .subscribe(
          data => {
            resolve(JSON.parse(xml2json(data.toString(), {compact: true, ignoreComment: true, spaces: 4})).root);
          },
          err => {
            reject('Error Search');
          });
    });
  }

  async GlobalSearch() {
    let tmpTracks = [{itunes: {}, youtube: {}, deezer: {}}];

    return new Promise((resolve, reject) => {
      this.ItunesSearch().then((data: any) => {
          if (data && data.resultCount > 0) {
            let items = data.results;
            tmpTracks['0'].itunes = {'itunesUrl': items['0'].trackViewUrl};
          }
        }
      ).catch(function (e) {});
      this.YoutubeSearch().then((data: any) => {
          if (data && data.items.length > 0) {
            let items = data.items;
            tmpTracks['0'].youtube = {'youtubeUrl': 'https://www.youtube.com/watch?v=' + items['0'].id.videoId };
          }
        }
      ).catch(function (e) {});
      this.DeezerSearch().then((data: any) => {
          if (data && data.total._cdata != "0") {
            let items = data.data.track;
            tmpTracks['0'].deezer = {'deezerUrl': items.link._cdata};
          }
        }
      ).catch(function (e) {});
      resolve(tmpTracks);
    });
  }

  goToIndex() {
    console.log(this.spotifyTrack['search']);

    this.navCtrl.push(HomePage, {
      search: this.spotifyTrack['search']
    });
  }


  spotifyUrl() {
    window.open(this.spotifyTrack['url'],"_system");
  }

  itunesUrl() {
    window.open(this.spotifyTrack['externes_url']['0'].itunes.itunesUrl,"_system") ;
  }

  youtubeUrl() {
    window.open(this.spotifyTrack['externes_url']['0'].youtube.youtubeUrl,"_system") ;
  }

  deezerUrl() {
    window.open(this.spotifyTrack['externes_url']['0'].deezer.deezerUrl,"_system");
  }

}
