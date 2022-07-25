// Gift Card Email Preview Popup (gift-card-email-preview-popup)
(RaiselyComponents) => {
  const {styled} = RaiselyComponents;
  const {Button} = RaiselyComponents.Atoms;
  const {Modal} = RaiselyComponents.Molecules;
  const {useCommunicator} = RaiselyComponents.Modules;

  const EmailWrapper = styled("div")`
    display: flex;
    flex-direction: column;
    background-color: #ededed;
    margin: 0 auto;
    padding: 20px;
    max-width: 600px;
    min-width: 320px;
    width: 320px;
    width: calc(28000% - 167400px);
    overflow-wrap: break-word;
    word-wrap: break-word;
    word-break: break-word;
    text-align: left;
    font-size: 14px;
    line-height: 21px;
    font-family: Avenir, sans-serif;
    color: #181818;
    text-align: center;
  `;


  const TextContainer = styled("div")`
    margin-top: 20px;
  `;

  const MessageContainer = styled(TextContainer)`
    /*text-align: left;*/
    white-space: pre-wrap;
    margin-bottom: 20px;
    font-size: 16px;
    font-style: italic;
    /*font-family: merriweather,georgia,serif;*/
  `;

  const Divider = styled("div")`
    display: block;
    font-size: 2px;
    line-height: 2px;
    margin: 20px auto;
    width: 40px;
    background-color: #ccc;
  `;

  const TitleContainer = styled("div")`
    font-weight: bold;
    font-size: 16px;
    margin: 20px auto 0 auto;
    width: 100%;
    color: #eebb00;
  `;

  const SendLetterTitleContainer = styled(TitleContainer)`
    font-size: 14px;
    margin-top: 40px;
  `;

  const SendLetterBtn = styled("a")`
    pointer-events: none;
    border-radius: 0;
    display: inline-block;
    font-size: 11px;
    font-weight: bold !important;
    line-height: 19px;
    padding: 6px 12px;
    text-decoration: none !important;
    color: #fbfbfb !important;
    background-color: #eebb00;
    font-family: Avenir, sans-serif;
    margin: 20px auto;

    :hover {
      opacity: 0.8;
    }
  `;

  const LogoImg = styled("img")`
    margin: 0 auto;
    display: block;
    height: auto;
    width: 100%;
    max-width: 231px;
  `;

  const StyledImage = styled("img")`
    width: 100%;
    max-width: 600px;
    object-fit: cover;
  `;

  const StyledButtonWrapper = styled("div")`
    display: flex;
    width: 100%;
    justify-content: ${(props) => props.buttonPosition === "left" ? "flex-start" : props.buttonPosition === "right" ? "flex-end" : "center"};
    justify-content: space-evenly;
    flex-wrap: wrap;

    .button {
      margin-top: 10px;
    }
  `;

  function getQueryVariable(variable) {
    const query = window.location.search.substring(1);
    const vars = query.split("&");
    for (let i = 0; i < vars.length; i++) {
      const pair = vars[i].split("=");
      if (pair[0] === variable) {
        return pair[1];
      }
    }
    return false;
  }


  const ModalContent = (
    inputProps,
    ecardImage,
    recipientName,
    message,
    donationAmount,
    showDonation,
    donoString,
    greetingString
  ) => (closePreview) => {
    const {
      previewHeaderWithName,
      previewHeaderNoName,
      title,
      para1,
      para2,
      sendLetterTitle,
      sendLetterParagraph,
      sendLetterButtonLabel,
      thankYouParagraph,
      solarBuddyLogo
    } = inputProps;

    const headerMsg = recipientName ? previewHeaderWithName.replaceAll("{name}", recipientName) : previewHeaderNoName;


    const replacement = showDonation ? donoString : "";
    const modifiedPara1 = para1.replaceAll("{donation_amount}", replacement);

    return (
      <div>
        <h4>{headerMsg}</h4>
        <EmailWrapper>
          <StyledImage src={ecardImage}/>
          <MessageContainer>
            {greetingString}
          </MessageContainer>
          <MessageContainer>
            {message}
          </MessageContainer>
          <Divider>&nbsp;</Divider>
          <TitleContainer>
            {title}
          </TitleContainer>
          <TextContainer>
            {modifiedPara1}
          </TextContainer>
          <TextContainer>
            {para2}
          </TextContainer>
          <SendLetterTitleContainer>
            {sendLetterTitle}
          </SendLetterTitleContainer>
          <TextContainer>
            {sendLetterParagraph}
          </TextContainer>
          <SendLetterBtn
            href={""}
            target="_blank"
          >
            {sendLetterButtonLabel}
          </SendLetterBtn>
          <TextContainer>
            {thankYouParagraph}
          </TextContainer>
          <Divider>&nbsp;</Divider>
          <LogoImg src={solarBuddyLogo}/>
        </EmailWrapper>
      </div>
    );
  };

  return (props) => {
    const {global} = useRaisely(true);
    const inputProps = props.getValues();

    const currencyString = global.currencies[global.detectedCurrency]?.symbol || "";
    const placeholderDonoString = `of ${currencyString}X `;

    let ecardImage = getQueryVariable("img") || "";
    const recipientName = useCommunicator("recipient-name").current;
    const message = useCommunicator("preview-message").current || "";
    const donationAmount = useCommunicator("donation-amount").current;
    const showDonation = useCommunicator("show-donation").current;
    const donoType = useCommunicator("dono-form-min").current;
    const donoString = useCommunicator("dono-string").current || placeholderDonoString;
    const greetingString = useCommunicator("greeting-string").current || "";

    if (!ecardImage || ecardImage.indexOf("raisely-images.imgix.net") === -1) {
      ecardImage = "https://raisely-images.imgix.net/ecard/uploads/sb-giftcard-03-png-c44689.png";
    }

    const chooseImageRedirectURL = `/${inputProps.chooseNewImageURL || ""}`;

    return (
      <>
        <StyledButtonWrapper buttonPosition={inputProps.buttonPosition}>
          <Modal
            modalContent={ModalContent(inputProps, ecardImage, recipientName, message, donationAmount, showDonation, donoString, greetingString)}
            button
            automatic={false}
            delay={null}
            buttonTitle={inputProps.previewButton}
            promptOnLeave={null}
            title={null}
          />
          <Button
            href={chooseImageRedirectURL}
            style={{paddingTop: "15px"}}
          >
            {inputProps.chooseANewImageButton}
          </Button>
        </StyledButtonWrapper>
      </>
    );
  }
}