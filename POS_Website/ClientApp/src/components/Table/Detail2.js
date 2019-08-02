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
