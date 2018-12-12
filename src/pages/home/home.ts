import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { CardIO, CardIOResponse, CardIOOptions } from '@ionic-native/card-io';
import { AppleWallet } from '@ionic-native/apple-wallet';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public showdata: any;
  public result: CardIOResponse;
  constructor(private appleWallet: AppleWallet, public platform: Platform, private cardIO: CardIO, public navCtrl: NavController) {
    console.log(this.result)

  }

  async scan() {
    this.cardIO.canScan()
      .then(
        (res: boolean) => {
          if (res) {
            let options = {
              requireExpiry: false,
              requireCVV: false,
              requirePostalCode: false,
              requireCardholderName: true,
              keepApplicationTheme: true,
              useCardIOLogo: true
            };
            return this.cardIO.scan(options);

          }


        }).then(res => {
          console.log(res);
          this.result = res;




          this.applesWallet();

        }, err => {
          alert(err);
        });
  }

  async scan2() {

    try {
      await this.platform.ready();
      const canScan = await this.cardIO.canScan();

      if (canScan) {
        const options: CardIOOptions = {
          scanInstructions: 'Scan your card to continue.'
        }
        this.result = await this.cardIO.scan(options);
        console.log(this.result)
      }
    }
    catch (error) {
      alert(error)
    }
  }

  applesWallet() {

    // Simple call to check whether the app can add cards to Apple Pay.
    this.appleWallet.available()
      .then((res) => {
        // Apple Wallet is enabled and a supported card is setup. Expect:
        // boolean value, true or false

        this.addCardinAppleWallet();
      })
      .catch((message) => {
        // Error message while trying to know if device is able to add to wallet
        alert(message)
      });


  }

  addCardinAppleWallet() {
    var cardNumber = this.result.cardNumber;
    var suffix_cardnumber = cardNumber.slice(-4);
    console.log(suffix_cardnumber)
    let data = {
      cardholderName: this.result.cardholderName,
      primaryAccountNumberSuffix: suffix_cardnumber,
      localizedDescription: 'TESTING DESCRIPTION IONIC',
      paymentNetwork: this.result.cardType
    }

    this.appleWallet.startAddPaymentPass(data)
      .then((res) => {
        alert(res)
      })
      .catch((err) => {
        // Error or user cancelled.
        alert(err)
      })
  }

}
