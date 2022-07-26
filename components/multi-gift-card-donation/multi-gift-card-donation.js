// Multi Gift Card Donation (multi-gift-card-donation)
(RaiselyComponents, React) => {
  const {styled, css} = RaiselyComponents;
  const {DonationForm} = RaiselyComponents.Molecules;
  const {useCommunicator} = RaiselyComponents.Modules;
  const {Button, Input} = RaiselyComponents.Atoms;

  function getQueryVariable(variable) {
    const query = window.location.search.substring(1);
    const vars = query.split("&");
    for (let i = 0; i < vars.length; i++) {
      const pair = vars[i].split("=");
      if (pair[0] == variable) {
        return pair[1];
      }
    }
    return (false);
  }

  const disableDonoBtnStyling = css`
    .donation-form__submit-button {
      pointer-events: none;
      opacity: 0.7;
    }
  `;

  const styledCheckboxInput = css`
    label {
      padding-top: 20px;
      display: flex;
      flex-direction: row;

      #donation-agreement-checkbox {
      	align-self: flex-start;
      }

      .form-field__label-text {
      	align-self: flex-start;
      }
    }
  `;

  const StyledButton = styled("div")`
    display: flex;
    padding-top: 20px;
    justify-content: ${
      (props) => props.buttonPosition === "left" ? "flex-start"
        : props.buttonPosition === "right" ? "flex-end" : "center"
    };
  `;

  const buildDonoString = (global, donoAmt, currencyType) => {
    let donoString = "";
    if (donoAmt && currencyType) {
      const currencyInfo = global.currencies[currencyType];
      if (currencyInfo) {
        donoString = `of ${currencyInfo.symbol}${!currencyInfo.zeroDecimal ? donoAmt / 100 : donoAmt} `;
      }
    }
    return donoString;
  };

  let donoFirstName = "";

  return (props) => {
    const {global, integrations} = useRaisely(true);
    const {
      thankYouTitle,
      thankYouMessage,
      fillOutFieldsMessage,
      sendAnotherCardButtonLabel,
      sendAnotherCardButtonPosition,
      donoAgreementCheckbox
    } = props.getValues();

    const [donationFinishValue, setDonationFinish] = React.useState(false);
    const [donationAmountEachVal, setDonationAmountEach] = React.useState();
    const [recipientListLengthVal, setRecipientListLength] = React.useState(0);
    const [rerenderVal, setRerender] = React.useState(false);
    const [currencyVal, setCurrency] = React.useState(global.detectedCurrency);
    const [checkboxValue, setCheckbox] = React.useState(false);

    let ecardImage = getQueryVariable("img");
    const message = useCommunicator("message").current;
    const showDonation = useCommunicator("show-donation").current;
    const sendDate = useCommunicator("send-date").current;
    const sendTime = useCommunicator("send-time").current;
    const senderName = useCommunicator("sender-name").current;
    const recipientList = useCommunicator("recipient-list").current || [];
    const resetFormState = useCommunicator("reset-fields");
    const donationAmountEach = useCommunicator("donation-amount").current;
    const currency = useCommunicator("currency-select").current || global.detectedCurrency;
    const sendDonoString = useCommunicator("dono-string");

    const AgreementCheckbox = (props) => {
      const {label} = props;

      return (
        <Input
          type="checkbox"
          classes={styledCheckboxInput}
          label={label}
          id={"donation-agreement-checkbox"}
          value={checkboxValue}
          change={(_id, value) => {
            setCheckbox(value);
          }
          }
        />
      );
    };

    if (!ecardImage || ecardImage.indexOf("raisely-images.imgix.net") === -1) {
      ecardImage = "https://raisely-images.imgix.net/ecard/uploads/sb-giftcard-03-png-c44689.png";
    }

    let amount;
    if (donationAmountEach && recipientList && recipientList.length) {
      console.log("~~ donationAmountEach:", donationAmountEach, "currency:", currency);
      amount = donationAmountEach * recipientList.length;
    }

    const builtDonoString = buildDonoString(global, donationAmountEach, currency);
    if (sendDonoString.send && builtDonoString !== sendDonoString.current) {
      sendDonoString.send(builtDonoString);
    }

    const customInterceptor = (options) => {
      const currentOptions = options || {};
      const currentOptionsData = currentOptions.data || {};
      const currentOptionsDataData = currentOptionsData.data || {};
      const currentPrivateData = currentOptionsDataData.private || {};
      const donoAmount = currentOptionsDataData.amount;
      const currencyType = currentOptionsDataData.currency;
      console.log("currentOptionsDataData.firstName:", currentOptionsDataData.firstName);
      if (currentOptionsDataData.firstName) {
        donoFirstName = currentOptionsDataData.firstName;
      }

      const senderNameStr = senderName ? senderName : "someone";

      let donoString = "";
      console.log("~~ amount:", amount, "donationAmountEach:", donationAmountEach, "type:", currentOptionsDataData.currency);
      if (showDonation) {
        donoString = buildDonoString(global, donationAmountEach, currencyType);
      }

      console.log("~~ donoString:", donoString);
      const recipientListStr = JSON.stringify(recipientList);
      const length = recipientListStr.length;
      const loops = Math.ceil(recipientListStr.length / 500);
      const recipientArr = [];
      for (let i = 0; i < loops; i++) {
        const strBit = recipientListStr.slice(i * 500, (i + 1) * 500);
        recipientArr.push(strBit);
      }
      console.log("~~ length:", length, "loops:", loops, "recipientArr:", recipientArr);


      const privateData = {
        ...currentPrivateData,
        recipientList1: recipientArr[0],
        recipientList2: recipientArr[1],
        recipientList3: recipientArr[2],
        recipientList4: recipientArr[3],
        recipientList5: recipientArr[4],
        recipientList6: recipientArr[5],
        recipientList7: recipientArr[6],
        recipientList8: recipientArr[7],
        recipientList9: recipientArr[8],
        recipientList10: recipientArr[9],
        recipientList11: recipientArr[10],
        recipientList12: recipientArr[11],
        recipientList13: recipientArr[12],
        recipientList14: recipientArr[13],
        recipientList15: recipientArr[14],
        recipientList16: recipientArr[15],
        recipientList17: recipientArr[16],
        recipientList18: recipientArr[17],
        recipientList19: recipientArr[18],
        recipientList20: recipientArr[19],
        recipientList21: recipientArr[20],
        recipientList22: recipientArr[21],
        recipientList23: recipientArr[22],
        recipientList24: recipientArr[23],
        recipientList25: recipientArr[24],
        recipientList26: recipientArr[25],
        recipientList27: recipientArr[26],
        recipientList28: recipientArr[27],
        recipientList29: recipientArr[28],
        recipientList30: recipientArr[29],
        recipientList31: recipientArr[30],
        recipientList32: recipientArr[31],
        recipientList33: recipientArr[32],
        recipientList34: recipientArr[33],
        recipientList35: recipientArr[34],
        recipientList36: recipientArr[35],
        recipientList37: recipientArr[36],
        recipientList38: recipientArr[37],
        recipientList39: recipientArr[38],
        recipientList40: recipientArr[39],
        recipientList41: recipientArr[40],
        recipientList42: recipientArr[41],
        recipientList43: recipientArr[42],
        recipientList44: recipientArr[43],
        recipientList45: recipientArr[44],
        recipientList46: recipientArr[45],
        recipientList47: recipientArr[46],
        recipientList48: recipientArr[47],
        recipientList49: recipientArr[48],
        recipientList50: recipientArr[49],
        senderName: senderNameStr,
        message,
        ecardImage,
        donoString
      };

      if (sendDate && sendTime) {
        const dates = sendDate.split("-");
        const date = new Date(dates[0], parseInt(dates[1]) - 1, dates[2], sendTime);
        privateData.sendDate = date.toJSON();
      } else {
        privateData.sendDate = undefined;
      }
      console.log("~~ donoAmount:", donoAmount);
      console.log("privateData:", privateData);
      const newData = {
        ...currentOptionsData,
        data: {
          ...currentOptionsDataData,
          private: privateData
        }
      };

      return {
        ...options,
        data: newData
      };
    };

    props.api.addRequestInterceptor(customInterceptor);

    const onSuccess = (_obj) => {
      setDonationFinish(true);
      resetFormState.send(true);
    };

    const checkVisible = (elm) => {
      const rect = elm.getBoundingClientRect();
      const viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
      return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
    };

    const onStepChange = (step) => {
      if (step === 1) {
        const donationFormButtonsArr = document.getElementsByClassName("donation-form__stages");
        if (donationFormButtonsArr.length) {
          const buttonElement = donationFormButtonsArr[0];
          if (!checkVisible(buttonElement)) {
            buttonElement.scrollIntoView();
          }
        }
      }
    };

    const onClickReset = () => {
      resetFormState.send(true);
      setDonationFinish(false);
      setCheckbox(false);
    };

    const className = recipientList.length && checkboxValue ? "" : disableDonoBtnStyling;

    console.log("donationAmountEach:", donationAmountEach);
    console.log("donationAmountEachVal:", donationAmountEachVal);
    console.log("recipientList:", recipientList);
    console.log("recipientListLengthVal:", recipientListLengthVal);
    console.log("rerenderVal:", rerenderVal);
    const donoAmtMatches = donationAmountEach === donationAmountEachVal;
    const recipientListLengthMatches = recipientList.length === recipientListLengthVal;
    const currencyMatches = currency === currencyVal;

    const changePresent = !donoAmtMatches || !recipientListLengthMatches || !currencyMatches;

    if (!rerenderVal && changePresent) {
      console.log("~~~~ made it here?");
      setRerender(true);
      setTimeout(() => {
        setDonationAmountEach(donationAmountEach);
        setRecipientListLength(recipientList.length);
        setCurrency(currency);
      }, 10)
    } else if (rerenderVal && !changePresent) {
      setRerender(false);
    }

    const thankMessage = thankYouMessage.replaceAll(" [donation.firstName]", ` ${donoFirstName}`);

    //console.log("~~ amount:", amount, "rerenderVal:", rerenderVal);
    if (amount && !rerenderVal) {
      return (
        <div className={className}>
          <DonationForm
            {...props}
            global={global}
            integrations={integrations}
            thankYouTitle={thankYouTitle}
            thankYouMessage={thankYouMessage}
            currencySelection="common"
            disabled={true}
            onSuccess={onSuccess}
            onStepChange={onStepChange}
            defaultDonationAmount={true}
            amount={amount}
            currency={currency}
          />
          <AgreementCheckbox label={donoAgreementCheckbox}/>
        </div>
      );
    } else if (donationFinishValue) {
      return (
        <div className={className}>
          <h4>{thankYouTitle}</h4>
          <p>{thankMessage}</p>
          <StyledButton buttonPosition={sendAnotherCardButtonPosition}>
            <Button
              onClick={onClickReset}
            >
              {sendAnotherCardButtonLabel}
            </Button>
          </StyledButton>
        </div>
      );
    } else {
      return (
        <div className={className}>
          <p>{fillOutFieldsMessage}</p>
        </div>
      );
    }
  };
}
