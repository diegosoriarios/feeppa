import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useFirebase from "../../hooks/useFirebase";
import { POST_TYPE } from "../../utils/consts";
import { v4 as uuidv4 } from "uuid";
import { useFormik } from "formik";

export function useEditForm () {
  const [isQuestion, setIsQuestion] = useState(true);
  const [tools, setTools] = useState([]);
  const [selectedTool, setSelectedTool] = useState("");
  const [contribuitionType, setContribuitionType] = useState("");
  const [attachment, setAttachment] = useState({});
  const [docId, setDocId] = useState("");
  const [isRejected, setIsRejected] = useState(false);

  const { state } = useLocation();

  const firebase = useFirebase();
  const navigate = useNavigate();

  
  const getInitialValues = async () => {
    const docs = await firebase.find("moderation", state.id, "values.cod");
    const items = [];

    docs.forEach((doc) => {
      items.push({id: doc.id, data:doc.data()});
    });

    const values = items[0].data.values;

    const initialItems = {
      type: values.contribuicao || "",
      title: values.titulo || "",
      description:
        values.descricaoResposta || values.descricaoContribuicao || "",
      contribuitionType: values.tipoContribuicao,
      link: values.link || "",
      created_at: values.created_at,
    };
    setIsQuestion(values.contribuicao === POST_TYPE.QUESTION);
    setDocId(items[0].id)
    setAttachment(values.arquivoResposta || values.videoResposta || {});
    setSelectedTool({
      values: values.ferramenta,
      label: values.ferramenta
    });
    setContribuitionType({
      values: values.tipoContribuicao,
      label: values.tipoContribuicao,
    });
    setIsRejected(values.rejeitada);

    formik.setValues(initialItems, false);
  };

  const getToolList = async () => {
    const ref = await firebase.read("tools");
    const items = [];

    ref.forEach((snapshot) => {
      const { values } = snapshot.data();
      items.push(values);
    });

    const set = Array.from(new Set(items));

    const list = set.map((item) => ({
      label: item,
      value: item,
    }));

    setTools(list);
  };

  const handleChange = async (e) => {
    await firebase.uploadFile(e.target.files[0], setAttachment);
  }

  const formik = useFormik({
    initialValues: {
      type: isQuestion ? POST_TYPE.QUESTION : POST_TYPE.CONTRIBUTION,
      title: "",
      description: "",
      contribuitionType: "",
      link: "",
    },
    onSubmit: (values) => handleForm(values),
  });

  const handleAttachment = (type) => {
    const attachmentIsEmpty = Object.keys(attachment).length === 0;

    if (attachmentIsEmpty) return "";

    const attachmentIsType = attachment.type.includes(type);
    
    if (!attachmentIsType) return "";

    return attachment;
  }

  const handleRemove = async () => {
    await firebase.removeFile(attachment, setAttachment);
  }

  const handleForm = async (values) => {
    const body = getBody(values);

    await firebase.update('moderation', { values: body }, docId);
    navigate("/moderation");
  };

  const getBody = (values) => {
    const unique_id = uuidv4();
    const cod = unique_id.slice(0, 8);
    const userId = localStorage.getItem("userName");

    const arquivoResposta = handleAttachment("image");
    const videoResposta = handleAttachment("video");

    const body = {
      cod,
      contribuicao: isQuestion ? POST_TYPE.QUESTION : POST_TYPE.CONTRIBUTION,
      usuario: userId,
      ferramenta: selectedTool.values,
      tipoContribuicao: contribuitionType.values,
      descricaoContribuicao: isQuestion ? "" : values.description,
      descricaoResposta: isQuestion ? values.description : "",
      arquivoResposta,
      videoResposta,
      aprovada: false,
      rejeitada: false,
      motivo: "",
      link: values.link,
      titulo: values.title,
      created_at: values.created_at,
    };

    return body;
  }

  return {
    isQuestion,
    tools,
    selectedTool,
    contribuitionType,
    attachment,
    formik,
    isRejected,
    setContribuitionType,
    setSelectedTool,
    setIsQuestion,
    getInitialValues,
    getToolList,
    handleChange,
    handleRemove,
    getBody,
  }
}