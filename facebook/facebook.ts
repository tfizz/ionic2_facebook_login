import { NativeStorage } from '@ionic-native/native-storage';
import { Facebook,FacebookLoginResponse } from '@ionic-native/facebook';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';


@Injectable()
export class FacebookProvider {

  constructor(public http: Http,public fb: Facebook,public nativeStorage: NativeStorage) {
    
  }

  login(){
    // this function is used to login into facebook and will return a promise
    let promise = new Promise((resolve,reject) => {
      this.fb.login(['public_profile','email']).then(
        (res : FacebookLoginResponse) => {
          // login successfull
          // save token 
          this.nativeStorage.setItem("fbToken",res.authResponse.accessToken);

          // hold user details
          let fb_id = res.authResponse.userID;

          // get user details
          this.fb.api("/me?fields=name,gender,email",['public_profile','email']).then(
            data => {
              data.picture = "https://graph.facebook.com/" + fb_id + "/picture?type=large";
              resolve(data);
            }
          ).catch(e => {
            //console.log('Unable to get user details', e);
            reject(e);
          })

        }
      ).catch(
        e => {
          //console.log('Error logging into Facebook', e);
          reject(e);
        }
      )
    });

    return promise;
  }

  logout(){
    // this function is used to logout of facebook and will return a promise
    let promise = new Promise((resolve,reject)=>{

      this.fb.logout().then(d=>{
        // successfully logged out. remove token
        this.nativeStorage.remove("fbToken");
        resolve("done");
      }).catch(e => {
        reject(e);
      });

    });

    return promise;
  }

}
