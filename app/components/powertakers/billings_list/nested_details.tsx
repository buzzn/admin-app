import * as React from 'react';
import { reduxForm } from 'redux-form';
import { FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl';
import { Row, Col } from 'reactstrap';
import EditableInput from 'components/editable_input';
import EditableSelect from 'components/editable_select';
import TwoColField from 'components/two_col_field';
import TwoColView from 'components/two_col_view';
import { NestedDetailsWrapper } from 'components/style';
import ItemDetails from './item_details';
import { ManageReadingContext } from './index';
import { ButtonsWrapper } from './style';

interface Props {
  dirty: boolean;
  handleSubmit: Function;
  validationRules: any;
  billing: any;
}

interface State {
  editMode: boolean;
}

class NestedDetails extends React.Component<Props & InjectedIntlProps, State> {
  state = { editMode: false };

  switchEditMode = (event) => {
    const { dirty, intl } = this.props;
    const { editMode } = this.state;
    if (dirty && editMode && confirm(intl.formatMessage({ id: 'admin.messages.cancelDirtyForm' }))) {
      this.setState({ editMode: false });
    } else if (!dirty) {
      this.setState({ editMode: !editMode });
    } else {
      event.currentTarget.blur();
      event.preventDefault();
    }
  };

  render() {
    const { handleSubmit, validationRules, billing } = this.props;
    const { editMode } = this.state;

    const prefix = 'admin.billings';
    const centered = 'true';

    return (
      <NestedDetailsWrapper>
        <Row>
          <Col xs={6}>
            <TwoColView {...{ prefix, field: 'customerName', centered }}>{billing.name.value}</TwoColView>
          </Col>
          <Col xs={6}>
            <TwoColView {...{ prefix, field: 'customerEmail', centered }}>
              <a href={`mailto:${billing.contract.customer.email}`}>{billing.contract.customer.email}</a>
            </TwoColView>
          </Col>
          <Col xs={6}>
            <TwoColView {...{ prefix, field: 'registerMeta', centered }}>
              {billing.contract.registerMeta.name}
            </TwoColView>
          </Col>
          <Col xs={6}>
            <TwoColView {...{ prefix, field: 'contractNumber', centered }}>
              {billing.contract.fullContractNumber}
            </TwoColView>
          </Col>
        </Row>
        {!editMode && <i className="buzzn-pencil float-right" onClick={this.switchEditMode} />}
        <form onSubmit={handleSubmit}>
          <Row>
            <Col xs={6}>
              <TwoColField
                {...{
                  prefix,
                  name: 'invoiceNumber',
                  editMode,
                  validationRules,
                  component: EditableInput,
                }}
              />
            </Col>
            <Col xs={6}>
              <TwoColField
                {...{
                  prefix,
                  name: 'status',
                  editMode,
                  validationRules,
                  component: EditableSelect,
                }}
              />
            </Col>
          </Row>
          {editMode && (
            <ButtonsWrapper>
              <div className="float-right mt-3">
                <button className="btn btn-link" onClick={this.switchEditMode}>
                  <FormattedMessage id="admin.buttons.cancel" /> <i className="fa fa-times" />
                </button>
                <button className="btn btn-primary" type="submit">
                  <FormattedMessage id="admin.buttons.submit" />
                </button>
              </div>
            </ButtonsWrapper>
          )}
        </form>
        <h5>
          <FormattedMessage id={`${prefix}.headerBillingItems`} />:
        </h5>
        {billing.items.array.map(item => (
          <ItemDetails key={item.id} {...{ item, ManageReadingContext }} />
        ))}
      </NestedDetailsWrapper>
    );
  }
}

export default reduxForm({ enableReinitialize: true })(injectIntl(NestedDetails));
