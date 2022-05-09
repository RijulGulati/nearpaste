import { Button, Form, Input, message, Space, Spin, Tooltip } from "antd";
import { GetServerSideProps, NextPage } from "next";
import style from "../../styles/Paste.module.scss";
import { DownloadOutlined, CopyOutlined } from "@ant-design/icons";
import { BASE_URL, decrypt, PasteUx } from "../../utils/common";
import { useEffect, useState } from "react";
import { getPaste } from "../../utils/near";
import { useRouter } from "next/router";

interface PastePassword {
  password: string;
}

const Paste: NextPage = () => {
  const router = useRouter();
  const [paste, setPaste] = useState<PasteUx>();
  const [loader, setLoader] = useState<boolean>(false);
  let { id } = router.query;

  useEffect(() => {
    async function getPasteDetails() {
      try {
        setLoader(true);
        let pasteId = "";
        if (id) {
          if (Array.isArray(id)) pasteId = id[0];
          else {
            pasteId = id;
          }
          const paste = await getPaste(pasteId);
          debugger;
          if (paste) {
            setPaste({ ...paste });
          }
          setLoader(false);
        }
      } catch (err: any) {
        debugger;
        setLoader(false);
        message.error(err);
      }
    }
    getPasteDetails();
  }, [id]);

  if (loader) {
    return (
      <>
        <span className={style["spinner"]}>
          <Spin size={"large"} />
          <p>Finding Paste...</p>
        </span>
      </>
    );
  } else {
    if (paste) {
      const onFinish = async (values: PastePassword) => {
        let content = decrypt(paste.content, values.password);
        if (!content) {
          message.error("Incorrect Password");
        } else {
          debugger;
          setPaste({
            content: content,
            id: paste.id,
            title: decrypt(paste.title, values.password),
            isEncrypted: false,
            timestamp: paste.timestamp,
          });
        }
      };

      if (paste.isEncrypted) {
        return (
          <>
            <h2>Encrypted Paste</h2>
            <Form name={"paste-content-form"} onFinish={onFinish}>
              <Form.Item
                name={"password"}
                rules={[
                  {
                    required: true,
                    message: "Please input password",
                  },
                ]}
              >
                <Input
                  className={style["textbox"]}
                  placeholder="Enter Password"
                  type={"password"}
                />
              </Form.Item>
              <Form.Item>
                <Button htmlType={"submit"} type={"primary"}>
                  {"Submit"}
                </Button>
              </Form.Item>
            </Form>
          </>
        );
      } else {
        return (
          <>
            <h2>{paste.title}</h2>
            <span className={style["content"]}>
              <Input.TextArea
                className={style["textbox"]}
                name={"paste-text"}
                defaultValue={paste.content}
                disabled
                rows={13}
              ></Input.TextArea>
              <br />
              <br />
              <Space size={"large"}>
                <Button
                  type="primary"
                  icon={<DownloadOutlined />}
                  size={"middle"}
                >
                  {" "}
                  Download{" "}
                </Button>
                <Button type={"ghost"} size={"middle"}>
                  {" "}
                  Raw{" "}
                </Button>
              </Space>
              <Input.Group className={style["url-group"]}>
                <Input
                  className={style["url-box"]}
                  defaultValue={`${BASE_URL}/${paste.id}`}
                  disabled
                />
                <Tooltip title="copy url">
                  <Button icon={<CopyOutlined />} />
                </Tooltip>
              </Input.Group>
            </span>
          </>
        );
      }
    } else {
      return <h2>Paste not found!</h2>;
    }
  }
};

export default Paste;
