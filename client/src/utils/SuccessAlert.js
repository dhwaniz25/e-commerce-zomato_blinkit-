import Swal from "sweetalert2";

const successAlert = (title) => {
  const alert = Swal.fire({
    icon: "success",
    title: title,
  });
  return alert;
};

export default successAlert;
