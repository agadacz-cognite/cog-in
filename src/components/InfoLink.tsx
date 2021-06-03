import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.span`
  background-color: #f0dfdf;
  margin: 8px;
  padding: 8px;
  width: 100%;
  font-weight: bold;
  text-align: center;
`;

type Props = { text: string };
export const InfoLink = (props: Props): JSX.Element => {
  const { text } = props;
  return <Wrapper>{text}</Wrapper>;
};
