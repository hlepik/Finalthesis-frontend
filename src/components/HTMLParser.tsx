import DOMPurify from "dompurify";
import parse from "html-react-parser";
import React, { FC } from "react";

interface IHTMLParser {
  html: string | null;
}

const HTMLParser: FC<IHTMLParser> = ({ html }) =>
  html ? <>{parse(DOMPurify.sanitize(html))}</> : null;

export default HTMLParser;
