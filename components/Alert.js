import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  },
});

const toast = (title = '', icon = true) => {
  Toast.fire({
    icon: icon ? 'success' : 'error',
    title,
  });
};

const confirm = (callback) => {
  Swal.fire({
    title: 'Anda Yakin?',
    text: 'Data akan diproses lebih lanjut!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
  }).then((result) => {
    if (result.isConfirmed) {
      callback();
    }
  });
};

export default { toast, confirm };
