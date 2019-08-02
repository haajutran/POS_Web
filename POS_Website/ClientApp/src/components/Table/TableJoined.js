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

class TableJoined extends Component {
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
  };

  getImageNull(item) {
    const { tableTypes } = this.props;
    return tableTypes.find(i => i.tableType1 === item.tableType).imageNull;
  }

  render() {
    // console.log(statisticSelected);
    const { tables } = this.props;
    return (
      <div>
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
          dataSource={tables}
          renderItem={item => (
            <List.Item onClick={() => this.join(item.tableCode)}>
              <div>
                <img
                  style={{ width: "100%" }}
                  src={
                    "data:image/png;base64, " + this.getImageNull(item)
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
          )}
        />
      </div>
    );
  }
}

const TJ = Form.create({ name: "tj" })(TableJoined);

export default connect(
  state => state.tableMap,
  dispatch => bindActionCreators(actionCreators, dispatch)
)(TJ);
