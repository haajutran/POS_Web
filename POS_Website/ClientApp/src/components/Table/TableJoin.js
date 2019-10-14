import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actionCreators } from "../../store/TableMap";
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
  List
} from "antd";

const { TextArea, Search } = Input;

class TableJoin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableAreas: [],
      joined: []
    };
  }

  componentWillMount() {
    this.fetchData();
  }

  fetchData = async () => {
    await this.props.requestTableTypes();
    await this.props.requestTableAreas();
    await this.setState({
      tableAreas: this.props.tableAreas
    });
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

  componentDidUpdate() {
    const { tableAreas } = this.state;
    if (tableAreas.length === 0) {
      this.fetchData();
    }
  }

  renderTablePickup(item) {
    // const aaa = this.checkTableHold(item.checkNo)

    return (
      <div>
        <img
          style={{ width: "100%" }}
          src={"data:image/png;base64, " + this.getImagePickup(item.tableType)}
          alt="img"
        />

        <div className="centered">
          <p>
            {item.tableCode}
            {item.tableJoin}
          </p>
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
      </div>
    );
  }

  join = tableCode => {
    const { tableAreas, joined } = this.state;
    if (joined.includes(tableCode)) {
      joined.splice(joined.indexOf(tableCode), 1);
    } else {
      joined.push(tableCode);
    }
    this.setState({
      joined
    });
    // var table = tableAreas[tIndex].tableMaps[taIndex];

    // table["join"] = !table["join"];
    // this.setState({
    //   tableAreas
    // });
  };

  handleClose = () => {
    this.setState({
      tableAreas: [],
      joined: []
    });
    this.props.cancelJoin();
  };

  handleOK = () => {
    const { joined } = this.state;
    this.props.okJoin(joined);
  };

  render() {
    // console.log(statisticSelected);
    const { joined } = this.state;
    const { tableAreas, tableTypes, isLoading, tableCode } = this.props;
    return (
      <div>
        <div className="actions">
          <Button type="danger" onClick={() => this.handleClose()}>
            Cancel
          </Button>
          <Button
            onClick={() => this.handleOK()}
            type="success"
            style={{ float: "right" }}
          >
            OK
          </Button>
        </div>

        <div className="content">
          {tableTypes && tableAreas.length > 0 ? (
            tableAreas.map(ta => (
              <div className="table-map-grid">
                <h3>{ta.tableAreaName}</h3>
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
                  renderItem={item =>
                    item.bkTbl === "0" && item.tableCode !== tableCode ? (
                      <List.Item onClick={() => this.join(item.tableCode)}>
                        <div
                          className={
                            joined.includes(item.tableCode) && "table-join"
                          }
                        >
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
                          </div>
                        </div>
                      </List.Item>
                    ) : (
                      <span />
                    )
                  }
                />
              </div>
            ))
          ) : (
            <h3>Empty</h3>
          )}
        </div>
      </div>
    );
  }
}

const TJ = Form.create({ name: "tj" })(TableJoin);

export default connect(
  state => state.tableMap,
  dispatch => bindActionCreators(actionCreators, dispatch)
)(TJ);
