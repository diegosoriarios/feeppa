import { useState } from "react";
import useFirebase from "../../hooks/useFirebase";
import { useLocation, useNavigate } from "react-router-dom";
import { POST_TYPE } from "../../utils/consts";
import { useSelector } from "react-redux";

export function useModeration(post) {
  const [isLoading, setIsLoading] = useState(true);
  const [motive, setMotive] = useState("");
  const [show, setShow] = useState(false);
  const user = useSelector((state) => state.auth.user);

  const { state } = useLocation();

  const handleClose = () => {
    setMotive("");
    setShow(false);
    navigate("/moderation")
  };
  const handleShow = (index) => {
    if (post?.motivo) setMotive(post?.motivo);
    setShow(true);
  };

  const firebase = useFirebase();
  const navigate = useNavigate();

  const generateBody = (question, isApproved) => ({
    cod: question.cod,
    contribuicao: question.contribuicao,
    usuario: question.usuario,
    ferramenta: question.ferramenta,
    tipoContribuicao: question.contribuitionType || "",
    descricaoContribuicao: question.descricaoContribuicao || "",
    linkContribuicao: question.link || "",
    arquivoContribuicao:
      question.contribuicao === POST_TYPE.CONTRIBUTION
        ? question.arquivoResposta || ""
        : "",
    descricaoResposta: question.descricaoResposta || "",
    arquivoResposta:
      question.contribuicao === POST_TYPE.QUESTION
        ? question.arquivoResposta || ""
        : "",
    videoResposta: question.attachment || "",
    aprovada: isApproved,
    rejeitada: !isApproved,
    motivo: motive,
    titulo: question.titulo,
    answers: [],
  });

  const incrementCounts = async () => {
    let values = { ...user, curadoriaCount: user.curadoriaCount + 1 };

    await firebase.incrementValue("user", { values }, user.doc);
  };

  const handleModeration = async (isApproved) => {
    setIsLoading(true);

    try {
      const question = post;

      const body = generateBody(question, isApproved);

      if (body.rejeitada) return updateModeration(body);

      addNewToolToFirebase(body.ferramenta);
      await firebase.create("questions", body);

      incrementCounts();
      removeFromModerationList();
    } catch (e) {
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const addNewToolToFirebase = async (ferramenta) => {
    const ref = await firebase.read("tools");
    const items = [];

    ref.forEach((snapshot) => {
      const { values } = snapshot.data();
      items.push({
        id: values,
        name: values,
      });
    });

    const alreadyExists = items.filter((item) => item.name === ferramenta);

    if (!alreadyExists.length) await firebase.create("tools", ferramenta);
  };

  const removeFromModerationList = async () => {
    const docs = await firebase.find("moderation", state.id, "values.cod");
    const items = [];

    docs.forEach((doc) => {
      items.push(doc.id);
    });

    await firebase.remove("moderation", items[0]);

    navigate("/home");
  };

  const updateModeration = async (item) => {
    const docs = await firebase.find("moderation", state.id, "values.cod");
    const items = [];

    docs.forEach((doc) => {
      items.push(doc.id);
    });

    await firebase.update("moderation", { values: item }, items[0]);
    handleClose();
  };

  const handleRemove = async () => {
    setIsLoading(true);
    try {
      const docs = await firebase.find("moderation", state.id, "values.cod");
      const items = [];

      docs.forEach((doc) => {
        items.push(doc.id);
      });

      await firebase.remove("moderation", items[0]);
      handleClose();
    } catch (e) {
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    setIsLoading,
    user,
    motive,
    setMotive,
    show,
    setShow,
    handleShow,
    handleModeration,
    handleClose,
    generateBody,
    incrementCounts,
    handleRemove,
  };
}
