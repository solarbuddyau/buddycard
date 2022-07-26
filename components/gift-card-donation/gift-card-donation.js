// Gift Card Donation (gift-card-donation)
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

  const StyledButton = styled("div")`
    display: flex;
    padding-top: 20px;
    justify-content: ${
      (props) => props.buttonPosition === "left" ? "flex-start"
        : props.buttonPosition === "right" ? "flex-end" : "center"
    };
  `;

  return (props) => {
    const {global, integrations} = useRaisely(true);
    const {
      thankYouTitle,
      thankYouMessage,
      sendAnotherCardButtonLabel,
      sendAnotherCardButtonPosition
    } = props.getValues();

    const [donationFinishValue, setDonationFinish] = React.useState(false);

    let ecardImage = getQueryVariable("img");
    const recipientName = useCommunicator("recipient-name").current;
    const recipientEmail = useCommunicator("recipient-email").current;
    const isValidEmail = useCommunicator("valid-email").current;
    const message = useCommunicator("message").current;
    const showDonation = useCommunicator("show-donation").current;
    const sendDate = useCommunicator("send-date").current;
    const sendTime = useCommunicator("send-time").current;
    const senderName = useCommunicator("sender-name").current;
    const resetFormState = useCommunicator("reset-fields");

    if (!ecardImage || ecardImage.indexOf("raisely-images.imgix.net") === -1) {
      ecardImage = "https://raisely-images.imgix.net/ecard/uploads/sb-giftcard-03-png-c44689.png";
    }

    const customInterceptor = (options) => {
      const currentOptions = options || {};
      const currentOptionsData = currentOptions.data || {};
      const currentOptionsDataData = currentOptionsData.data || {};
      const currentPrivateData = currentOptionsDataData.private || {};
      const donoAmount = currentOptionsDataData.amount;
      const currencyType = currentOptionsDataData.currency;

      const senderNameStr = senderName ? senderName : "someone";
      const recipientNameStr = recipientName ? ` ${recipientName}` : "";

      let donoString = "";
      if (showDonation && donoAmount && currencyType) {
        const currencyInfo = global.currencies[currencyType];
        if (currencyInfo) {
          donoString = `of ${currencyInfo.symbol}${!currencyInfo.zeroDecimal ? donoAmount / 100 : donoAmount} `;
        }
      }

      const privateData = {
        ...currentPrivateData,
        recipientEmail,
        recipientName: recipientNameStr,
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
      if (step === 2) {
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
      const initialStateButtonArr = document.getElementsByClassName("donation-form__stage--0");
      if (initialStateButtonArr.length) {
        const initialStateButton = initialStateButtonArr[0];
        initialStateButton.click();
      }
    };

    const className = isValidEmail ? "" : disableDonoBtnStyling;

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
        />
        {donationFinishValue ?
          (<StyledButton buttonPosition={sendAnotherCardButtonPosition}>
            <Button
              onClick={onClickReset}
            >
              {sendAnotherCardButtonLabel}
            </Button>
          </StyledButton>)
          : null
        }
      </div>
    );
  };
};