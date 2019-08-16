import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
// import { actionCreators } from "../../store/TableDetail";
import {
  Icon,
  Badge,
  Row,
  Col,
  Input,
  Button,
  Table,
  Form,
  Breadcrumb
} from "antd";
// import moment from "moment";
// import * as CurrencyFormat from "react-currency-format";
const columns = [
  {
    title: "Qty",
    dataIndex: "qty",
    key: "name"
  },
  {
    title: "Item Name",
    dataIndex: "name",
    key: "age"
  },
  {
    title: "Sub Amount",
    dataIndex: "sa",
    key: "address"
  },
  {
    title: "Amount",
    dataIndex: "a",
    key: "address"
  }
];
const dataSource = [
  {
    key: "1",
    qty: "1.00",
    name: 32,
    sa: "10 Downing Street",
    a: ""
  },
  {
    key: "2",
    qty: "1.00",
    name: 32,
    sa: "10 Downing Street",
    a: ""
  },
  {
    key: "1",
    qty: "1.00",
    name: 32,
    sa: "10 Downing Street",
    a: ""
  },
  {
    key: "2",
    qty: "1.00",
    name: 32,
    sa: "10 Downing Street",
    a: ""
  }
];
class TableDetail2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bsMenus: [{}],
      previousMenuNo: "",
      selectedGuest: 0,
      selectedCourse: 0,
      currentMenu: ""
    };
  }

  render() {
    return (
      <div className="detail-page">
        <div className="dt2-h">
          <Row>
            <Col xl={18}>
              <Row>
                <Col xl={18}>
                  <Row>
                    <Col xl={6}>
                      <b>Open Bill</b>
                    </Col>
                    <Col xl={18}>
                      <span>asdasd</span>
                    </Col>
                  </Row>
                </Col>
                <Col xl={6}>
                  <Row>
                    <Col xl={6}>
                      <b>Table</b>
                    </Col>
                    <Col xl={18}>
                      <span>asdasd</span>
                    </Col>
                  </Row>
                </Col>
                <Col xl={18}>
                  <Row>
                    <Col xl={6}>
                      <b>Open By</b>
                    </Col>
                    <Col xl={18}>
                      <span>asdasd</span>
                    </Col>
                  </Row>
                </Col>
                <Col xl={6}>
                  <Row>
                    <Col xl={6}>
                      <b>Adult</b>
                    </Col>
                    <Col xl={18}>
                      <span>asdasd</span>
                    </Col>
                  </Row>
                </Col>
                <Col xl={18}>
                  <Row>
                    <Col xl={6}>
                      <b>Client</b>
                    </Col>
                    <Col xl={18}>
                      <span>asdasd</span>
                    </Col>
                  </Row>
                </Col>
                <Col xl={6}>
                  <Row>
                    <Col xl={6}>
                      <b>Child</b>
                    </Col>
                    <Col xl={18}>
                      <span>asdasd</span>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
            <Col xl={3}>
              <div className="sz">
                <div className="checkNo">33000562</div>
                <div className="time">10:22</div>
              </div>
            </Col>
            <Col xl={3}>
              <Button className="hb-btn">Hide Bill</Button>
            </Col>
          </Row>
          <div className="btnz">
            <Row>
              <Col xl={21}>
                <Button type="primary" icon="appstore" />
                <Button>#1</Button>
              </Col>
              <Col xl={3}>
                <Button style={{ width: "100%" }}>Check Bill</Button>
              </Col>
            </Row>
          </div>
        </div>

        <div>
          <Table dataSource={dataSource} columns={columns} />
        </div>
        <div className="dt2-actions">
          <div className="btn-sp">
            <Button className="sp-btn">
              <Icon type="bell" />
              Recall Order
            </Button>
            <Button className="btn-d">
              <p>Add/Rmv</p>
              <p>Tax/Svr</p>
            </Button>
            <Button className="btn-d">Order Message</Button>
            <Button className="btn-d" icon="printer">
              Print View
            </Button>
          </div>
          <div className="btn-sp">
            <Button className="btn-d" icon="rocket">
              Send Order
            </Button>
            <Button className="btn-d" icon="retweet">
              <span>Change Quantity</span>
            </Button>
            <Button className="btn-d">Request</Button>
            <Button className="btn-d">Post Quickly</Button>
            <Button className="btn-d" icon="printer">
              Print
            </Button>
          </div>
          <div style={{ flexGrow: 8 }}>ádasd</div>
          <div className="btn-sp">
            <Button className="btn-d" icon="tag">
              Item Discount
            </Button>
            <Button className="btn-d">
              <span>Apply Voucher</span>
            </Button>
            <Button className="btn-d">Auto Discount</Button>
            <Button className="btn-d">Client Discount</Button>
            <Button className="btn-d">Order Info</Button>
          </div>
          <div className="btn-sp">
            <Button className="btn-d" icon="close">
              Void
            </Button>
            <Button className="sp-btn">
              <Icon type="dollar" />
              Pay Cash
            </Button>
            <Button className="btn-d" icon="user">
              Select Client
            </Button>
            <Button className="btn-d">Merge</Button>
          </div>
          <div className="btn-sp">
            <Button className="btn-d" icon="close-circle">
              Cancel Bill
            </Button>
            <Button className="sp-btn">
              <Icon type="bell" />
              Other Pay
            </Button>
            <Button className="btn-d" icon="user-delete">
              Cancel Client
            </Button>
            <Button className="btn-d">Slipt Bill</Button>
          </div>
          <div className="btn-sp">
            <Button className="btn-d" icon="plus-square">
              Sum Bill
            </Button>
            <Button className="btn-d">
              <span>Item Voucher</span>
            </Button>
            <Button className="btn-d">Discount</Button>
            <Button className="btn-d">Redeem Point</Button>
            <Button className="btn-d">Share Table</Button>
          </div>
        </div>
      </div>
    );
  }
}
// const DF = Form.create({ name: "df" })(TableDetail);

// export default connect(
//   state => state.tableDetail,
//   dispatch => bindActionCreators(actionCreators, dispatch)
// )(DF);

export default TableDetail2;
