import {Component} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {HttpHeaders} from '@angular/common/http';
import {NavController, NavParams} from 'ionic-angular';
import {Env} from '../../app/config'
import {TrackPage} from '../track/track';

@Component({
  templateUrl: 'home.html'
})
export class HomePage {

  tracks: string[];
  sSearchTrack = '';

  constructor(public http: HttpClient, public navCtrl: NavController, public navParams: NavParams) {
    this.sSearchTrack = navParams.get('search');
  }

  obtainSpotifyAccessToken() {
    return new Promise((resolve, reject) => {
      let params = new URLSearchParams();
      params.append('grant_type', 'client_credentials');
      let options = {
        headers: new HttpHeaders({
          'Content-type': 'application/x-www-form-urlencoded; charset=utf-8',
          'Authorization': 'Basic ' + btoa(Env.spotify_client + ":" + Env.spotify_secret)
        }),
      };

      this.http.post('spotify-account/api/token', params.toString(), options)
        .subscribe(
          data => {
            resolve(data);
          },
          err => {
            reject('Invalid Credentials');
          });
    });
  }

  async spotifySearch(sSearch) {
    let oToken: any = await this.obtainSpotifyAccessToken();
    return new Promise((resolve, reject) => {
      let options = {
        headers: new HttpHeaders({
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + oToken.access_token,
        }),
      };

      this.http.get('https://api.spotify.com/v1/search?q=' + sSearch + '&type=track', options)
        .subscribe(
          data => {
            resolve(data);
          },
          err => {
            reject('Error Search');
          });
    });
  }

  async GlobalSearch(sSearch) {
    let tmpTracks = [];
    let tmpSearch = this.sSearchTrack;

    return new Promise((resolve, reject) => {
      this.spotifySearch(sSearch.trim()).then((data: any) => {
          if (data && data.tracks.total > 0) {
            let items = data.tracks.items;
            items.forEach(function (value) {
              tmpTracks.push({'search': tmpSearch, 'name': value.name, 'artist': value.artists['0'].name, 'type': "spotify", 'image': value.album.images['0'].url, 'url': value.external_urls.spotify});
            });
          }
        }
      ).catch(function (e) {});
      resolve(tmpTracks);
    });
  }

  getItems(ev: any) {
    // Reset items back to all of the items
    this.tracks = [];

    // set val to the value of the searchbar
    const val = ev.target.value;
    this.sSearchTrack = val;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.GlobalSearch(val.trim()).then((data: any) => {
          return (this.tracks = data);
        }
      );
    }
  }

  goTOTrackPage(track) {
    let dataTrack = track;

    this.navCtrl.push(TrackPage, {
      track: dataTrack
    });
  }

}
