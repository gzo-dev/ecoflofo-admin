import React, { Component, Fragment } from 'react';
import { Switch, Route } from 'react-router-dom'
import Header from './header';
// import Home from './dashboard';
import SideBar from './sidebar';
// import Shop from './view/shop';
import Product from './view/product'
import Category from './view/category';
import Areas from './view/tours';
import Location from './view/location';
import Order from './view/order';
import Customer from './view/customer';
import User from './view/user';
import Payment from './view/payment';
import VendorProduct from './view/shop/product';
import Voucher from './view/voucher';
import Contact from './view/contact';
import Tours from './view/tours';
import Blogs from './view/blog';
import { getCookie } from '../../function';
import GuardPage from './view/guard';


export default class rootRoutes extends Component {
  render() {
    const { match } = this.props;
    return (
      <main>
        {/* <Header /> */}
        <div id="layoutSidenav">
          <SideBar />
          <Switch>
            {getCookie("role")=== "admin" && <Fragment>
              <Route exact path={[`${match.path}/home`, `${match.path}`]} component={Product} />
              {/* <Route path={`${match.path}/shop`} component={Shop} /> */}
              <Route path={`${match.path}/product`} component={Product} />
              <Route path={`${match.path}/category`} component={Category} />
              <Route path={`${match.path}/area`} component={Areas} />
              <Route path={`${match.path}/tour`} component={Tours} />
              <Route path={`${match.path}/location`} component={Location} />
              <Route path={`${match.path}/order`} component={Order} />
              <Route path={`${match.path}/customer`} component={Customer} />
              <Route path={`${match.path}/user`} component={User} />
              <Route path={`${match.path}/payment`} component={Payment} />
              <Route path={`${match.path}/vendor`} component={VendorProduct} />
              <Route path={`${match.path}/voucher`} component={Voucher} />
              <Route path={`${match.path}/contact`} component={Contact} />
              <Route path={`${match.path}/blog`} component={Blogs} />
            </Fragment>}
            {getCookie("role")=== "fulltime" && <Fragment>
              <Route exact path={[`${match.path}/home`, `${match.path}`]} component={Product} />
              {/* <Route path={`${match.path}/shop`} component={Shop} /> */}
              <Route path={`${match.path}/product`} component={Product} />
              <Route path={`${match.path}/category`} component={Category} />
              <Route path={`${match.path}/area`} component={Areas} />
              <Route path={`${match.path}/tour`} component={Tours} />
              <Route path={`${match.path}/location`} component={Location} />
              <Route path={`${match.path}/order`} component={Order} />
              <Route path={`${match.path}/customer`} component={Customer} />
              <Route path={`${match.path}/payment`} component={Payment} />
              <Route path={`${match.path}/vendor`} component={VendorProduct} />
              <Route path={`${match.path}/voucher`} component={Voucher} />
              <Route path={`${match.path}/contact`} component={Contact} />
              <Route path={`${match.path}/blog`} component={Blogs} />
              <Route path={`${match.path}/user`} component={GuardPage} />
            </Fragment>}
            {getCookie("role")=== "parttime" && <Fragment>
              <Route exact path={[`${match.path}/home`, `${match.path}`]} component={Product} />
              {/* <Route path={`${match.path}/shop`} component={Shop} /> */}
              <Route path={`${match.path}/product`} component={GuardPage} />
              <Route path={`${match.path}/category`} component={GuardPage} />
              <Route path={`${match.path}/area`} component={GuardPage} />
              <Route path={`${match.path}/tour`} component={GuardPage} />
              <Route path={`${match.path}/location`} component={GuardPage} />
              <Route path={`${match.path}/order`} component={GuardPage} />
              <Route path={`${match.path}/customer`} component={GuardPage} />
              <Route path={`${match.path}/payment`} component={GuardPage} />
              <Route path={`${match.path}/vendor`} component={GuardPage} />
              <Route path={`${match.path}/voucher`} component={GuardPage} />
              <Route path={`${match.path}/contact`} component={GuardPage} />
              <Route path={`${match.path}/blog`} component={Blogs} />
              <Route path={`${match.path}/user`} component={GuardPage} />
            </Fragment>}
          </Switch>
        </div>
      </main>
    );
  }
}