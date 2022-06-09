import Account from './accountApi';
import Address from './addressApi';
import Board from './boardApi';
import Cart from './cartApi';
import Noti from './notiApi';
import Device from './DeviceApi';
import Order from './orderApi';
import Page from './pageApi';
import Payment from './paymentApi';
import Product from './productApi';
import Profile from './profileApi';
import Promotion from './promotionApi';
import SimCard from './simCardApi';
import Subscription from './subscriptionApi';
import User from './userApi';
import Api from './api';
import Country from './country';
import Utils from './utils';
import AppVersion from './appVersionApi';

const API = {
  get default() {
    return Api;
  },
  get Account() {
    return Account;
  },
  get Address() {
    return Address;
  },
  get Board() {
    return Board;
  },
  get Cart() {
    return Cart;
  },
  get Noti() {
    return Noti;
  },
  get Order() {
    return Order;
  },
  get Page() {
    return Page;
  },
  get Payment() {
    return Payment;
  },
  get Product() {
    return Product;
  },
  get Profile() {
    return Profile;
  },
  get Promotion() {
    return Promotion;
  },
  get SimCard() {
    return SimCard;
  },
  get Subscription() {
    return Subscription;
  },
  get User() {
    return User;
  },
  get Device() {
    return Device;
  },
  get AppVersion() {
    return AppVersion;
  },
};

export {API, Utils, Country};
