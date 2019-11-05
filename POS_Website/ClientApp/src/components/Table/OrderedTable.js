import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actionCreators } from "../../store/TableMap";
import { message, Input, Button, Table, Form, Modal, List } from "antd";

class OrderedTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableAreas: [],
      choseTable: "",
      selectBillModalVisible: false,
      bills: [],
      selectedBill: ""
    };
  }

  componentWillMount() {
    this.fetchData();
  }

  fetchData = async () => {
    await this.props.requestTableTypes();
    await this.props.requestTableAreas();
    this.setState({
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

  chooseTable = table => {
    this.setState({
      choseTable: table.tableCode
    });
    this.checkTable(table);
  };

  handleClose = () => {
    this.setState({
      tableAreas: [],
      choseTable: ""
    });
    this.props.cancelJoin();
  };

  handleOK = () => {
    const { choseTable } = this.state;
    console.log(choseTable);
  };

  checkTable = table => {
    const { tableAreas } = this.props;
    const tableArea = tableAreas.find(
      ta => ta.tableArea1 + "" === table.tableArea + ""
    );
    const tableBills = tableArea.tableMaps.filter(
      t => t.tableCode === table.tableCode
    );
    if (tableBills.length > 1) {
      this.setState({
        bills: tableBills
      });
      this.showSelectBillModal();
    } else {
      this.checkBill(tableBills[0].checkNo);
    }
  };

  showSelectBillModal = () => {
    this.setState({
      selectBillModalVisible: true
    });
  };

  hideSelectBillModal = () => {
    this.setState({
      selectBillModalVisible: false,
      bills: []
    });
  };

  confirmSelectBillModal = () => {
    const checkNo = this.state.selectedBill.checkNo;
    this.checkBill(checkNo);
  };

  checkBill = async checkNo => {
    const dataGetBill = {
      SelectedGuest: "0",
      CheckNo: checkNo,
      SelectedCourse: "0"
    };
    const billDetail = await this.props.getBillDetail(dataGetBill);
    var isValid = true;
    billDetail.data.forEach(item => {
      if (isValid) {
        if (item.baseSub < 0) {
          isValid = false;
          message.warn("Bill has discount!");
          return false;
        }
      }
    });
    if (isValid) {
      this.setState({
        selectBillModalVisible: false,
        bills: []
      });
      this.props.selectOtherTable(checkNo);
    }
  };

  selectBill = bill => {
    this.setState({
      selectedBill: bill
    });
  };

  render() {
    // console.log(statisticSelected);
    const { choseTable, bills, selectedBill } = this.state;
    console.log(bills);
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
                    item.bkTbl === "0" &&
                    item.subTableNo === "1" &&
                    item.checkNo !== "0" &&
                    item.checkNo !== tableCode ? (
                      <List.Item onClick={() => this.chooseTable(item)}>
                        <div
                          className={
                            choseTable === item.tableCode && "table-join"
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
        <Modal
          title={`Table: ${choseTable}`}
          visible={this.state.selectBillModalVisible}
          onOk={this.confirmSelectBillModal}
          onCancel={this.hideSelectBillModal}
        >
          <Table
            dataSource={bills}
            columns={columns}
            onRowClick={bill => this.selectBill(bill)}
            rowClassName={(record, index) =>
              record.checkNo === selectedBill.checkNo ? "selected-bill" : ""
            }
          />
        </Modal>
      </div>
    );
  }
}

const columns = [
  {
    title: "Sub",
    dataIndex: "subTableNo",
    key: "subTableNo"
  },
  {
    title: "Check No",
    dataIndex: "checkNo",
    key: "checkNo"
  },
  {
    title: "Amount",
    dataIndex: "amount",
    key: "amount"
  },
  {
    title: "Adult",
    dataIndex: "tGuest",
    key: "tGuest"
  },
  {
    title: "Child",
    dataIndex: "tChild",
    key: "tChild"
  }
];

const OT = Form.create({ name: "tj" })(OrderedTable);

export default connect(
  state => state.tableMap,
  dispatch => bindActionCreators(actionCreators, dispatch)
)(OT);
