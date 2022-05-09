import { Button, Divider, Form, Input, message } from "antd";
import type { NextPage } from "next";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import style from "../styles/Home.module.scss";
import { Paste } from "../utils/common";
import {
  getNodeInfoFromNetworkId,
  getTxnSuccessValue,
  NETWORK_ID,
} from "../utils/near";

interface PasteForm {
  content: string;
  title: string;
  password?: string;
}

const Home: NextPage = () => {
  const [loader, setLoader] = useState<boolean>(false);
  const [buttonText, setButtonText] = useState<string>("");
  const [txnId, setTxnId] = useState<string>("");
  const [pasteId, setPasteId] = useState<string>("");

  useEffect(() => {
    if (loader) {
      setButtonText("Creating...");
    } else {
      setButtonText("Create New Paste");
    }
  }, [loader]);

  const onFinish = async (values: PasteForm) => {
    debugger;
    try {
      setLoader(true);
      const paste = new Paste(values.title, values.content, values.password);
      let result = await paste.createPaste();
      debugger;
      setLoader(false);
      let pasteResult = getTxnSuccessValue(result.executionOutcome.status);
      if (pasteResult === "true") {
        setTxnId(result.executionOutcome.transaction_outcome.id);
        setPasteId(result.id);
      }
    } catch (err: any) {
      message.error(err);
      setLoader(false);
      console.error(err);
    }
  };

  const onFinishFailed = (error: any) => {
    console.log("Failed: ", error);
  };

  return (
    <>
      <h2>New Paste</h2>
      <Form
        className={style["form"]}
        name={"paste-form"}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          name={"title"}
          rules={[
            {
              required: true,
              message: "Please input title",
            },
          ]}
        >
          <Input placeholder="Title" />
        </Form.Item>
        <Form.Item
          name={"content"}
          rules={[
            {
              required: true,
              message: "Please input content",
            },
          ]}
        >
          <Input.TextArea
            rows={13}
            style={{ resize: "none" }}
            placeholder="Content"
          />
        </Form.Item>
        <Form.Item
          name={"password"}
          rules={[
            {
              required: false,
            },
          ]}
        >
          <Input placeholder="Password (Optional)" type={"password"} />
        </Form.Item>
        <Form.Item>
          <Button htmlType={"submit"} type={"primary"} loading={loader}>
            {buttonText}
          </Button>
        </Form.Item>
      </Form>

      <Divider />
      <>
        {txnId ? (
          <>
            <p>
              Transaction Id:{" "}
              <Link
                href={`${
                  getNodeInfoFromNetworkId(NETWORK_ID).explorerUrl
                }/transactions/${txnId}`}
              >
                <a target={"_blank"}>{txnId}</a>
              </Link>
            </p>

            <p>
              <Link href={`/${pasteId}`}>
                <a style={{ display: "flex", alignItems: "center" }}>
                  View Paste <FaArrowRight style={{ marginLeft: "5px" }} />
                </a>
              </Link>
            </p>
          </>
        ) : (
          <></>
        )}
      </>
    </>
  );
};

export default Home;
