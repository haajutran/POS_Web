import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actionCreators } from "../../../store/TableMap";
import {
  Icon,
  Badge,
  Row,
  Col,
  Input,
  Button,
  Table,
  Form,
  Select,
  Modal,
  List,
  Collapse,
  message
} from "antd";

const { Panel } = Collapse;

class TableMerge extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableAreas: [],
      merged: ""
    };
  }

  componentWillMount() {
    this.fetchData();
  }

  fetchData = async () => {
    await this.props.requestTableTypes();
    this.props.requestTableAreas();
    this.props.requestRVCQuickInfomation();
  };

  getImagePickup(tableType) {
    const { tableTypes } = this.props;
    return tableTypes.find(i => i.tableType1 === tableType).imagePickup;
  }

  handleClickTable = tableCheckNo => {
    const { merged } = this.state;
    var temp = "";
    if (merged !== tableCheckNo) {
      temp = tableCheckNo;
    }
    this.setState({
      merged: temp
    });
  };

  handleOK = async () => {
    const { merged } = this.state;
    if (merged === "") {
      message.error("Please choose table!");
      return;
    }
    const res = await this.props.mergeTable(merged);
    if (res.status === 200) {
      message.success("Success.");
      this.setState({
        merged: ""
      });
      this.props.cancelMerge();
    }
  };

  render() {
    // console.log(statisticSelected);
    const { checkNo, tableAreas, tableTypes, isLoading } = this.props;
    var displayed = [];
    const { merged } = this.state;
    console.log(tableAreas);
    return (
      <div>
        <div className="actions">
          <Button type="danger" onClick={() => this.props.cancelMerge()}>
            Cancel
          </Button>
          <Button onClick={() => this.handleOK()}>OK</Button>
        </div>

        {isLoading ? (
          <span>Loading</span>
        ) : (
          <Collapse defaultActiveKey={["0"]} accordion>
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
                      xxl: 8
                    }}
                    dataSource={ta.tableMaps}
                    renderItem={
                      (item, index) =>
                        !displayed.includes(item.tableCode) ? (
                          (displayed.push(item.tableCode),
                          (
                            <div
                              onClick={() =>
                                this.handleClickTable(item.checkNo)
                              }
                            >
                              <List.Item
                                className={`table-item ${merged.includes(
                                  item.checkNo
                                ) && "active"}`}
                              >
                                {item.checkNo !== "0" &&
                                  item.checkNo !== checkNo && (
                                    <div className="table-item-content">
                                      <img
                                        style={{ width: "100%" }}
                                        src={
                                          "data:image/png;base64, " +
                                          this.getImagePickup(item.tableType)
                                        }
                                        alt="img"
                                      />
                                      <div className="centered">
                                        <p>
                                          <span className="table-code">
                                            {item.tableCode}
                                          </span>
                                          <span> {item.tableJoin}</span>
                                        </p>
                                        {item.bkTbl === "1" && (
                                          <p className="reserved-table">
                                            RESERVED
                                          </p>
                                        )}
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
                                          <Icon
                                            type="pause-circle"
                                            className={`holding`}
                                          />
                                        )}
                                      </div>
                                    </div>
                                  )}
                              </List.Item>
                            </div>
                          ))
                        ) : (
                          <div>...</div>
                        )

                      // <List.Item>
                      //   {item.checkNo !== "0" ? (
                      //     !displayed.includes(item.tableCode) &&
                      //     (displayed.push(item.tableCode) && (
                      //       <div>{this.renderTablePickup(item)}</div>
                      //     ))
                      //   ) : (
                      //     <Link to={`/detailempty/${item.tableCode}`}>
                      //       {console.log(ta.tableMaps)}
                      //       <img
                      //         style={{ width: "100%" }}
                      //         src={
                      //           "data:image/png;base64, " +
                      //           this.getImageNull(item)
                      //           // tableTypes.find(
                      //           //   i => i.tableType1 === item.tableType
                      //           // ).imageNull
                      //         }
                      //         alt="img"
                      //       />
                      //       <div className="centered">
                      //         <p className="table-info">
                      //           <span>{item.tableCode}</span>
                      //         </p>
                      //         {item.bkTbl === "1" && (
                      //           <p className="reserved-table">RESERVED</p>
                      //         )}
                      //       </div>
                      //     </Link>
                      //   )}
                      // </List.Item>
                    }
                  />
                </div>
              </Panel>
            ))}
          </Collapse>
        )}
      </div>
    );
  }
}

const TM = Form.create({ name: "TM" })(TableMerge);

export default connect(
  state => state.tableMap,
  dispatch => bindActionCreators(actionCreators, dispatch)
)(TM);
