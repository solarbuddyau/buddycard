(RaiselyComponents, React) => (props) => {
  const {styled} = RaiselyComponents;

  const {header, secondPageAddress} = props.getValues();
  const {img1, img2, img3, img4, img5, img6, img7, img8, img9} = props.getValues();
  const {text1, text2, text3, text4, text5, text6, text7, text8, text9} = props.getValues();
  const marginX = 10;
  const imgWidth = window.innerWidth < 360 ? window.innerWidth - marginX * 2 : 340;
  const imgHeight = imgWidth * (650 / 900); // preserved size ratio to match email
  const maxWidth = (imgWidth * 3) + (marginX * 6);

  const StyledContainer = styled("div")`
    margin: auto;
  `;

  const HeaderContainer = styled("h4")`
    margin-left: ${marginX}px;
  `;

  const ImageContainerRow = styled("div")`
    display: flex;
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap;
    max-width: ${maxWidth}px;
  `;

  const MediaContainer = styled("div")`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 16px ${marginX}px;
  `;

  const ImageLink = styled("a")`
    height: ${imgHeight}px;
    width: ${imgWidth}px;
    border: 4px solid transparent;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;

    :hover {
      border: 5px;
    }
  `;

  const TextContainer = styled("div")`
    max-width: ${imgWidth}px;
  `;

  const BroadcasterImg = (props) => {
    const style = {
      backgroundImage: `url(${props.src})`
    };

    return props.src ? (
      <MediaContainer>
        <ImageLink
          style={style}
          theme="primary"
          href={`/${secondPageAddress}?img=${encodeURI(props.src)}`}
        />
        <TextContainer>
          {props.desc}
        </TextContainer>
      </MediaContainer>
    ) : null;
  };

  return (
    <StyledContainer>
      <HeaderContainer>{header}</HeaderContainer>
      <ImageContainerRow>
        <BroadcasterImg src={img1} desc={text1}/>
        <BroadcasterImg src={img2} desc={text2}/>
        <BroadcasterImg src={img3} desc={text3}/>
        <BroadcasterImg src={img4} desc={text4}/>
        <BroadcasterImg src={img5} desc={text5}/>
        <BroadcasterImg src={img6} desc={text6}/>
        <BroadcasterImg src={img7} desc={text7}/>
        <BroadcasterImg src={img8} desc={text8}/>
        <BroadcasterImg src={img9} desc={text9}/>
      </ImageContainerRow>
    </StyledContainer>
  );
}