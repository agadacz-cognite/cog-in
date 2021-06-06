import styled from 'styled-components';

type TWrapper = { background?: string };
export const Wrapper = styled.div.attrs((props: TWrapper) => {
  const style: any = {};
  if (props.background) {
    style.backgroundImage = `url(${props.background})`;
  }
  return { style };
})<TWrapper>`
  width: 100%;
  height: 100%;
  display: flex;
  margin: auto;
  justify-content: center;
  align-items: center;
  background-repeat: repeat;
  background-attachment: fixed;
  overflow-y: auto;
`;

export const DevBanner = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  padding: 24px;
  font-size: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  text-shadow: 0 0 10px red;
  z-index: 1000;
  ::after {
    content: '--- DEV VERSION ---';
  }
`;
