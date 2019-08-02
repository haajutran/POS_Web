import React, { Component } from "react";

import { Link } from "react-router-dom";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actionCreators } from "../store/TableMap";
import {
  List,
  Row,
  Col,
  Card,
  Statistic,
  Modal,
  Button,
  Icon,
  Collapse
} from "antd";

const { Panel } = Collapse;

function warning() {
  Modal.warning({
    title: "Alert!",
    content: "The current date and the date on the system do not match!"
  });
}
var isHolding = 0;
class TableMap extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    await this.props.requestTableTypes();
    this.props.requestTableAreas();
    this.props.requestRVCQuickInfomation();
    this.checkPOSInfo();
  }

  checkPOSInfo = async () => {
    await this.props.requestPOSInfo();
    const posDate = sessionStorage.getItem("posDate");
    console.log(posDate);
    // if (POSInfo.length > 0) {
    //   const posDate = new Date(POSInfo[0].posDate);
    //   const today = new Date();
    //   if (posDate !== today) {
    //     warning();
    //   }
    // }
  };

  getImageNull(item) {
    const { tableTypes } = this.props;
    return tableTypes.find(i => i.tableType1 === item.tableType).imageNull;
  }
  getImagePickup(tableType) {
    const { tableTypes } = this.props;
    return tableTypes.find(i => i.tableType1 === tableType).imagePickup;
  }
  async checkTableHold(checkNo) {
    const res = await this.props.checkTableHold(checkNo);
    return res;
  }

  renderTablePickup(item) {
    // const aaa = this.checkTableHold(item.checkNo)

    return (
      <Link to={`/tableDetail/${item.checkNo}`}>
        <img
          style={{ width: "100%" }}
          src={"data:image/png;base64, " + this.getImagePickup(item.tableType)}
          alt="img"
        />

        <div className="centered">
          <p>
            <span className="table-code"> {item.tableCode}</span>
            <span> {item.tableJoin}</span>
          </p>
          {item.bkTbl === "1" && <p className="reserved-table">RESERVED</p>}
          <p className="table-info">
            <span>
              {item.tGuest}/{item.tChild}
            </span>
            |<span>({item.tSubtable})</span>
          </p>
          <p>{item.amount}</p>
          <p>{item.openTime}</p>
          <p
            className={`status ${
              item.lastChgTime <= 45
                ? "success"
                : item.lastChgTime <= 80
                ? "warning"
                : "danger"
            }`}
          />

          {item.tableHold > 0 && (
            <Icon type="pause-circle" className={`holding`} />
          )}
        </div>
      </Link>
    );
  }

  render() {
    const {
      tableAreas,
      tableTypes,
      isLoading,
      RVCQuickInfomation
    } = this.props;

    var displayed = [];
    return (
      <div>
        <h2>Table Map</h2>
        {isLoading ? (
          <h3>Loading...</h3>
        ) : (
          <div>
            {RVCQuickInfomation.length > 0 && (
              <div className="dashboard">
                <div>
                  <Row gutter={16}>
                    {RVCQuickInfomation.map(item => (
                      <Col lg={6} xl={4}>
                        <Card
                          style={{
                            background:
                              "linear-gradient(to right, #00b4db, #0083b0)"
                          }}
                        >
                          <Statistic
                            title={item.title}
                            className="short"
                            value={item.dataReturn}
                          />
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </div>
              </div>
            )}
            {tableTypes && tableAreas.length > 0 ? (
              <Collapse accordion>
                {tableAreas.map((ta, taIndex) => (
                  <Panel header={ta.tableAreaName} key={taIndex}>
                    <div className="table-map-grid">
                      <List
                        grid={{
                          gutter: 16,
                          xs: 1,
                          sm: 2,
                          md: 4,
                          lg: 4,
                          xl: 6,
                          xxl: 3
                        }}
                        dataSource={ta.tableMaps}
                        renderItem={(item, index) => (
                          <List.Item>
                            {item.checkNo !== "0" ? (
                              !displayed.includes(item.tableCode) &&
                              (displayed.push(item.tableCode),
                              <div>{this.renderTablePickup(item)}</div>)
                            ) : (
                              <Link to={`/detailempty/${item.tableCode}`}>
                                <img
                                  style={{ width: "100%" }}
                                  src={
                                    "data:image/png;base64, " +
                                    this.getImageNull(item)
                                    // tableTypes.find(
                                    //   i => i.tableType1 === item.tableType
                                    // ).imageNull
                                  }
                                  alt="img"
                                />

                                <div className="centered">
                                  <p className="table-info">
                                    <span>{item.tableCode}</span>
                                  </p>
                                  {item.bkTbl === "1" && (
                                    <p className="reserved-table">RESERVED</p>
                                  )}
                                </div>
                              </Link>
                            )}
                          </List.Item>
                        )}
                      />
                    </div>
                  </Panel>
                ))}
              </Collapse>
            ) : (
              <h3>Empty</h3>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default connect(
  state => state.tableMap,
  dispatch => bindActionCreators(actionCreators, dispatch)
)(TableMap);
