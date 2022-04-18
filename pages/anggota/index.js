import Layout from '../../components/Layout';
import {
  FcApproval,
  FcBusinessman,
  FcBusinesswoman,
  FcInfo,
  FcManager,
  FcVoicePresentation,
} from 'react-icons/fc';
import {
  IoAddCircleSharp,
  IoCloudUploadOutline,
  IoSaveOutline,
  IoSearchCircle,
  IoTrashBinOutline,
} from 'react-icons/io5';
import styles from './Anggota.module.css';
import { useField } from '../../hooks';
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import {
  setProvinsiOptions,
  setKabupatenOptions,
  setKecamatanOptions,
  setKelurahanOptions,
} from '../../reducers/wilayahOptionsReducer';
import { useEffect, useRef, useState } from 'react';
import alert from '../../components/Alert';
import {
  deleteAnggota,
  initAnggota,
  saveAnggota,
  updateAnggota,
} from '../../reducers/anggotaReducer';
import DataTable from 'react-data-table-component';
import Image from 'next/image';
import { AiFillInfoCircle, AiOutlineEdit } from 'react-icons/ai';
import { format } from 'date-fns';
import { FaRegTimesCircle, FaTimes } from 'react-icons/fa';
import idDate from '../../lib/idDate';

const isInputEmpty = (value) => {
  return value ? styles.successInput : styles.errorInput;
};

const InputWarningText = ({ text, value }) => {
  return (
    <small className={`text-red-500 ${value ? 'hidden' : 'block'}`}>
      *{text} harus diisi
    </small>
  );
};

const Header = ({ Icons = [], text }) => {
  return (
    <div>
      <div className='flex align-middle gap-2'>
        {typeof Icons === 'object' ? (
          Icons.map((Icon, index) => (
            <div key={index}>
              <Icon size='2em' />
            </div>
          ))
        ) : (
          <Icons size='2em' />
        )}
        <h1 className='text-xl font-bold my-auto'>{text}</h1>
      </div>
      <hr className='my-2' />
    </div>
  );
};

const Anggota = ({ data = null }) => {
  const nama = useField('text');
  const gender = useField('text');
  const nik = useField('number');
  const kta = useField('text');
  const pekerjaan = useField('text');
  const alamat = useField('text');
  const tanggalDaftar = useField('date');
  const noHP = useField('number');
  const statusAnggota = useField('text');
  const tanggalLahir = useField('date');
  const [provinsi, setProvinsi] = useState('');
  const [kabupaten, setKabupaten] = useState('');
  const [kecamatan, setKecamatan] = useState('');
  const [kelurahan, setKelurahan] = useState('');
  const [foto, setFoto] = useState('');
  const uploadRef = useRef();
  const formRef = useRef();
  const [visibleForm, setVisibleForm] = useState(false);
  const wilayahOptions = useSelector((state) => state.wilayahOptions);
  const anggota = useSelector((state) => state.anggota);
  const [filteredAnggota, setFilteredAnggota] = useState([]);
  const [isUpdate, setIsUpdate] = useState('');
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [detailsAnggota, setDetailsAnggota] = useState('');

  const dispatch = useDispatch();

  const DetailsAnggota = ({ anggota }) => {
    const Icon = ({ className }) => {
      return anggota.gender === 'laki-laki' ? (
        <FcBusinessman className={className} size='1.5em' />
      ) : (
        <FcBusinesswoman className={className} size='1.5em' />
      );
    };

    const Description = ({ title, text }) => {
      return (
        <div className='grid grid-cols-3 my-1'>
          <span className='block capitalize'>{title}</span>
          <strong className='block capitalize col-span-2'>{text}</strong>
        </div>
      );
    };

    return (
      <div className='overlay grid absolute place-items-center top-0 bottom-0 left-0 right-0 bg-black-rgba p-4 h-screen overflow-y-auto'>
        <div className='p-4 rounded bg-white shadow sm:w-6/12 md:w-8/12 w-10/12'>
          <div className='header flex justify-between'>
            <div className='header__text font-bold sm:text-lg capitalize flex flex-wrap gap-3'>
              {<FcInfo size='1.5em' />}
              <span className='block'>Detail Anggota</span>
            </div>
            <FaRegTimesCircle
              size='2em'
              className='text-red-500 cursor-pointer'
              onClick={toggleOverlay}
            />
          </div>
          <hr className='mb-4 mt-2' />
          <div className='body overflow-y-auto sm:h-max'>
            <div className='grid grid-cols-1 sm:grid-cols-3 sm:gap-x-5 gap-y-5'>
              <div className='w-full h-full relative'>
                {/* eslint-disable-next-line */}
                <img
                  src={`/img/anggota/${anggota.foto}`}
                  alt={anggota.name}
                  className='rounded shadow-lg sm:w-full w-6/12 mx-auto'
                />
              </div>
              <div className='col-span-2'>
                <strong className='sm:text-xl text-lg block'>
                  <Icon className='inline' /> Biodata
                </strong>
                <div className='my-2'>
                  <Description title='Nama Lengkap' text={anggota.nama} />
                  <Description title='NIK' text={anggota.nik} />
                  <Description
                    title='Alamat'
                    text={`${anggota.alamat.jalan}, ${anggota.alamat.kelurahan.label}, ${anggota.alamat.kecamatan.label}, ${anggota.alamat.kabupaten.label}, ${anggota.alamat.provinsi.label}`}
                  />
                  <Description title='No. Telp' text={anggota.noHP} />
                  <Description title='Gender' text={anggota.gender} />
                  <Description
                    title='Tanggal Lahir'
                    text={idDate(anggota.tanggalLahir)}
                  />
                </div>
                <strong className='sm:text-xl text-lg block mb-2 mt-4'>
                  <FcApproval size='1.5em' className='inline' /> Keanggotaan
                </strong>
                <div className='my-2'>
                  <Description title='KTA' text={anggota.kta} />
                  <Description
                    title='Status Anggota'
                    text={anggota.statusAnggota}
                  />
                  <Description
                    title='Tanggal Daftar'
                    text={idDate(anggota.tanggalDaftar)}
                  />
                </div>
              </div>
            </div>
          </div>
          <hr className='mb-2 mt-4' />
          <div className='footer'>
            <div className='flex justify-end'>
              <button
                className='py-2 px-4 rounded shadow bg-slate-500 text-white hover:opacity-75'
                onClick={toggleOverlay}
              >
                <FaTimes className='inline mt-[-3px]' />
                Tutup
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const dataTableBuilder = (anggota = []) => {
    const columns = [
      {
        name: 'No',
        selector: (row) => row.no,
        center: true,
        sortable: true,
        grow: 0,
      },
      {
        name: 'Aksi',
        selector: (row) => row.aksi,
        center: true,
      },
      {
        name: 'Foto',
        selector: (row) => row.foto,
        center: true,
      },
      {
        name: 'Nama',
        selector: (row) => row.nama,
        center: true,
        sortable: true,
      },
      {
        name: 'No. KTA',
        selector: (row) => row.kta,
        center: true,
      },
      {
        name: 'Profesi',
        selector: (row) => row.pekerjaan,
        center: true,
      },
      {
        name: 'Provinsi',
        selector: (row) => row.provinsi,
        center: true,
      },
      {
        name: 'Kabupaten',
        selector: (row) => row.kabupaten,
        center: true,
      },
      {
        name: 'Kecamatan',
        selector: (row) => row.kecamatan,
        center: true,
      },
      {
        name: 'Kelurahan',
        selector: (row) => row.kelurahan,
        center: true,
      },
    ];

    const data = anggota.map((a, i) => {
      const data = {
        id: a.id,
        no: i + 1,
        aksi: (
          <div className='flex gap-2 flex-wrap'>
            <button
              className='p-2 rounded shadow bg-blue-500 text-white'
              title='Edit Anggota'
              value={a.id}
              onClick={editHandler}
            >
              <AiOutlineEdit />
            </button>
            <button
              className='p-2 rounded shadow bg-green-500 text-white'
              title='Detail Anggota'
              onClick={detailsHandler}
              value={a.id}
            >
              <AiFillInfoCircle />
            </button>
            <button
              className='p-2 rounded shadow bg-red-500 text-white'
              title='Hapus Anggota'
              value={a.id}
              onClick={deleteHandler}
            >
              <IoTrashBinOutline />
            </button>
          </div>
        ),
        foto: (
          <Image
            width='50em'
            height='50em'
            className='py-5 rounded-full'
            src={`/img/anggota/${a.foto}`}
            alt={a.nama}
          />
        ),
        nama: a.nama,
        kta: a.kta,
        pekerjaan: <span className='capitalize'>{a.pekerjaan}</span>,
        provinsi: a.alamat.provinsi.label,
        kabupaten: a.alamat.kabupaten.label,
        kecamatan: a.alamat.kecamatan.label,
        kelurahan: a.alamat.kelurahan.label,
      };
      return data;
    });

    const customStyles = {
      headCells: {
        style: {
          fontWeight: 'bold',
          backgroundColor: 'rgb(34 197 94)',
          color: 'white',
        },
      },
    };

    return {
      columns,
      data,
      pagination: true,
      striped: true,
      highlightOnHover: true,
      customStyles,
    };
  };

  const searchHandler = (e) => {
    const value = e.currentTarget.value;
    if (value === '') return setFilteredAnggota(anggota);
    const searchedAnggota = anggota.filter(
      (f) =>
        f.nama.toLowerCase().includes(value.toLowerCase()) ||
        f.kta.toLowerCase().includes(value.toLowerCase())
    );
    return setFilteredAnggota(searchedAnggota);
  };

  const uploadButtonHandler = (e) => {
    uploadRef.current.click();
  };

  const fotoHandler = (evt) => {
    const file = uploadRef.current.files[0];
    const fd = new FileReader();

    fd.addEventListener(
      'load',
      () => {
        setFoto(fd.result);
      },
      false
    );

    if (file) {
      fd.readAsDataURL(file);
    }
  };

  const submitHandler = async (evt) => {
    evt.preventDefault();
    try {
      const form = new FormData(formRef.current);
      form.set('provinsi', JSON.stringify(provinsi));
      form.set('kabupaten', JSON.stringify(kabupaten));
      form.set('kecamatan', JSON.stringify(kecamatan));
      form.set('kelurahan', JSON.stringify(kelurahan));
      dispatch(!isUpdate ? saveAnggota(form) : updateAnggota(isUpdate, form));
      alert.toast('Anggota berhasil disimpan');
      setVisibleForm(!visibleForm);
      resetInputField();
      setIsUpdate('');
    } catch (error) {
      const errorResponse = error.response.data.error;
      alert.toast(errorResponse, false);
    }
  };

  const resetInputField = () => {
    nama.reset();
    gender.reset();
    nik.reset();
    kta.reset();
    pekerjaan.reset();
    alamat.reset();
    tanggalDaftar.reset();
    noHP.reset();
    statusAnggota.reset();
    tanggalLahir.reset();
    setKabupaten(null);
    setKecamatan(null);
    setKelurahan(null);
    setFoto(null);
    setProvinsi(null);
  };

  const tambahHandler = () => {
    resetInputField();
    tanggalDaftar.setValue(format(new Date(), 'yyyy-MM-dd'));
    setVisibleForm(!visibleForm);
    setIsUpdate('');
  };

  const editHandler = (e) => {
    const id = e.currentTarget.value;
    setIsUpdate(id);
    const dataAnggota = anggota.find((a) => a.id === id);
    setVisibleForm(!visibleForm);
    nama.setValue(dataAnggota.nama);
    gender.setValue(dataAnggota.gender);
    nik.setValue(dataAnggota.nik);
    alamat.setValue(dataAnggota.alamat.jalan);
    pekerjaan.setValue(dataAnggota.pekerjaan);
    setProvinsi(dataAnggota.alamat.provinsi);
    setKabupaten(dataAnggota.alamat.kabupaten);
    setKecamatan(dataAnggota.alamat.kecamatan);
    setKelurahan(dataAnggota.alamat.kelurahan);
    setFoto(`/img/anggota/${dataAnggota.foto}`);
    kta.setValue(dataAnggota.kta);
    statusAnggota.setValue(statusAnggota);
    noHP.setValue(dataAnggota.noHP);
    tanggalDaftar.setValue(dataAnggota.tanggalDaftar);
    tanggalLahir.setValue(dataAnggota.tanggalLahir);
  };

  const detailsHandler = (e) => {
    const id = e.currentTarget.value;
    const details = anggota.find((f) => f.id === id);
    setDetailsAnggota(details);
    toggleOverlay();
  };

  const deleteHandler = (e) => {
    const id = e.currentTarget.value;
    alert.confirm(() => {
      dispatch(deleteAnggota(id));
    });
  };

  const toggleOverlay = () => setOverlayVisible(!overlayVisible);

  useEffect(() => {
    dispatch(setProvinsiOptions());
    dispatch(initAnggota());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setFilteredAnggota(anggota);
  }, [anggota]);

  return (
    <Layout title='Anggota'>
      <h1 className='md:text-lg font-bold'>Anggota PKB Jawa Barat</h1>
      <div className='my-2 flex flex-wrap gap-4'>
        <div className='w-max relative'>
          <button
            onClick={tambahHandler}
            className='p-2 group flex gap-2 bg-green-500 rounded-lg shadow text-white hover:rounded duration-100 active:bg-green-700'
          >
            <IoAddCircleSharp size='1.5em' />
            <div className=''>
              <span>Tambah Anggota</span>
            </div>
          </button>
        </div>
      </div>
      {visibleForm && (
        <form
          className='grid grid-cols-1 md:grid-cols-2 gap-4'
          ref={formRef}
          onSubmit={submitHandler}
          encType='multipart/form-data'
        >
          <div>
            <div className='bg-white rounded shadow p-4'>
              <Header text='Biodata' Icons={FcVoicePresentation} />
              <div className='grid grid-cols-1 sm:grid-cols-3 gap-2'>
                <div className='col-span-3 gap-2 grid grid-cols-1 sm:grid-cols-3'>
                  <div className='col-span-2'>
                    <small className='block'>Nama Lengkap : </small>
                    <input
                      {...nama.attr}
                      name='nama'
                      id='nama'
                      className={`${styles.input} ${isInputEmpty(nama.value)}`}
                    />
                    <InputWarningText text='Nama lengkap' value={nama.value} />
                  </div>
                  <div>
                    <small className='block'>Jenis Kelamin : </small>
                    <select
                      name='gender'
                      id='gender'
                      {...gender.attr}
                      className={`${styles.input} ${isInputEmpty(
                        gender.value
                      )} bg-white`}
                    >
                      <option value='' disabled selected hidden>
                        Pilih jenis kelamin..
                      </option>
                      <option value='laki-laki'>Laki-laki</option>
                      <option value='perempuan'>Perempuan</option>
                    </select>
                    <InputWarningText
                      text='Jenis Kelamin'
                      value={gender.value}
                    />
                  </div>
                </div>
                <div className='col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-2'>
                  <div>
                    <small className='block'>NIK : </small>
                    <input
                      {...nik.attr}
                      name='nik'
                      id='nik'
                      className={`${styles.input} ${isInputEmpty(nik.value)}`}
                    />
                    <InputWarningText text='NIK' value={nik.value} />
                  </div>
                  <div>
                    <small className='block'>Tanggal Lahir : </small>
                    <input
                      {...tanggalLahir.attr}
                      name='tanggalLahir'
                      id='tanggalLahir'
                      className={`${styles.input} ${isInputEmpty(
                        tanggalLahir.value
                      )}`}
                    />
                    <InputWarningText
                      text='Tanggal Lahir'
                      value={tanggalLahir.value}
                    />
                  </div>
                  <div>
                    <small className='block'>Pekerjaan : </small>
                    <select
                      name='pekerjaan'
                      id='pekerjaan'
                      {...pekerjaan.attr}
                      className={`${styles.input} ${isInputEmpty(
                        pekerjaan.value
                      )} bg-white`}
                    >
                      <option value='' selected hidden disabled>
                        Pilih pekerjaan..
                      </option>
                      <option value='petani'>Petani</option>
                      <option value='pedagang'>Pedagang</option>
                      <option value='nelayan'>Nelayan</option>
                      <option value='wiraswasta'>Wiraswasta</option>
                      <option value='pegawai'>Pegawai</option>
                      <option value='lainnya'>Lainnya</option>
                    </select>
                    <InputWarningText
                      text='Pekerjaan'
                      value={pekerjaan.value}
                    />
                  </div>
                </div>
                <div className='col-span-3'>
                  <small className='block'>Alamat : </small>
                  <textarea
                    rows='4'
                    {...alamat.attr}
                    name='alamat'
                    id='alamat'
                    className={`${styles.input} ${isInputEmpty(
                      alamat.value
                    )} resize-none`}
                  ></textarea>
                  <InputWarningText text='Alamat' value={alamat.value} />
                </div>
                <div className='col-span-3'>
                  <div className='grid grid-cols-2 md:grid-cols-4 gap-2 '>
                    <div>
                      <small>Provinsi: </small>
                      <Select
                        isSearchable
                        placeholder='Pilih...'
                        options={wilayahOptions.provinsi.filter(
                          (v) => v.value === 32
                        )}
                        onChange={(selected) => {
                          setKabupaten(null);
                          setKecamatan(null);
                          setKelurahan(null);
                          dispatch(setKabupatenOptions(selected.value));
                          setProvinsi(selected);
                        }}
                        value={provinsi}
                        name='provinsi'
                        id='provinsi'
                      />
                      <InputWarningText text='Provinsi' value={provinsi} />
                    </div>
                    <div>
                      <small>Kabupaten: </small>
                      <Select
                        isSearchable
                        placeholder='Pilih...'
                        options={wilayahOptions.kabupaten}
                        onChange={(selected) => {
                          setKecamatan(null);
                          setKelurahan(null);
                          dispatch(setKecamatanOptions(selected.value));
                          setKabupaten(selected);
                        }}
                        value={kabupaten}
                        name='kabupaten'
                        id='kabupaten'
                      />
                      <InputWarningText text='Kabupaten' value={kabupaten} />
                    </div>
                    <div>
                      <small>Kecamatan: </small>
                      <Select
                        isSearchable
                        placeholder='Pilih...'
                        options={wilayahOptions.kecamatan}
                        onChange={(selected) => {
                          setKelurahan(null);
                          dispatch(setKelurahanOptions(selected.value));
                          setKecamatan(selected);
                        }}
                        value={kecamatan}
                        name='kecamatan'
                        id='kecamatan'
                      />
                      <InputWarningText text='Kecamatan' value={kecamatan} />
                    </div>
                    <div>
                      <small>Kelurahan: </small>
                      <Select
                        isSearchable
                        placeholder='Pilih...'
                        options={wilayahOptions.kelurahan}
                        onChange={(selected) => {
                          setKelurahan(selected);
                        }}
                        value={kelurahan}
                        name='kelurahan'
                        id='kelurahan'
                      />
                      <InputWarningText text='Kelurahan' value={kelurahan} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className='bg-white rounded shadow p-4'>
              <Header text='Keanggotaan' Icons={FcManager} />
              <div className='grid grid-cols-1 sm:grid-cols-3 gap-2'>
                <div>
                  <div className='flex flex-col align-middle justify-center mb-2'>
                    {/* eslint-disable-next-line */}
                    <img
                      className='shadow-lg rounded-lg'
                      src={foto || '/img/Logo_PKB.svg'}
                      alt='profile picture'
                    />
                    <InputWarningText text='Foto anggota' value={foto} />
                  </div>
                  <div className='flex sm:justify-end justify-center'>
                    <button
                      type='button'
                      className='block text-white hover:opacity-80 active:bg-green-700 bg-green-500 py-1 px-3 rounded shadow'
                      onClick={uploadButtonHandler}
                    >
                      <IoCloudUploadOutline
                        className='inline mr-2'
                        size='1.5em'
                      />
                      <small>Upload</small>
                    </button>

                    <input
                      type='file'
                      name='foto'
                      accept='.jpg,.png'
                      className='hidden'
                      ref={uploadRef}
                      onChange={fotoHandler}
                      required={isUpdate ? false : true}
                    />
                  </div>
                </div>
                <div className='col-span-2'>
                  <div className='gap-2 grid grid-cols-1 sm:grid-cols-2'>
                    <div className='col-span-2'>
                      <div className='grid gap-2 grid-cols-1 sm:grid-cols-3'>
                        <div className='col-span-2'>
                          <small className='block my-auto'>KTA : </small>
                          <input
                            {...kta.attr}
                            name='kta'
                            id='kta'
                            className={`${styles.input} ${isInputEmpty(
                              kta.value
                            )}`}
                          />
                          <InputWarningText text='KTA' value={kta.value} />
                        </div>
                        <div>
                          <small className='block my-auto'>Status : </small>
                          <select
                            name='statusAnggota'
                            id='statusAnggota'
                            {...statusAnggota.attr}
                            className={`${styles.input} ${isInputEmpty(
                              statusAnggota.value
                            )} bg-white`}
                          >
                            <option
                              className='text-slate-400 italic'
                              value=''
                              selected
                              disabled
                              hidden
                            >
                              Pilih status..
                            </option>
                            <option value='umum'>Umum</option>
                            <option value='DPC'>DPC</option>
                          </select>
                          <InputWarningText
                            text='Status Anggota'
                            value={statusAnggota.value}
                          />
                        </div>
                      </div>
                    </div>
                    <div className='col-span-2'>
                      <div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
                        <div>
                          <small className='block'>No. HP : </small>
                          <input
                            {...noHP.attr}
                            name='noHP'
                            id='noHP'
                            className={`${styles.input} ${isInputEmpty(
                              noHP.value
                            )}`}
                          />
                          <InputWarningText text='No. HP' value={noHP.value} />
                        </div>
                        <div>
                          <small className='block'>Tangal Daftar : </small>
                          <input
                            name='tanggalDaftar'
                            id='tanggalDaftar'
                            {...tanggalDaftar.attr}
                            className={`${styles.input} ${isInputEmpty(
                              tanggalDaftar.value
                            )}`}
                          />
                          <InputWarningText
                            text='Tanggal Daftar'
                            value={tanggalDaftar.value}
                          />
                        </div>
                      </div>
                    </div>
                    <div className='col-span-2 flex justify-end'>
                      <button
                        type='submit'
                        className='py-2 px-4 rounded shadow bg-blue-500 text-white hover:opacity-80 active:bg-blue-700'
                      >
                        <IoSaveOutline size='1.3em' className='inline mr-2' />
                        <small>Simpan</small>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      )}
      <div className='p-4 my-2 rounded shadow-lg bg-white'>
        <div className='flex justify-end my-2'>
          <div className='p-2 rounded shadow border-[1px] '>
            <IoSearchCircle
              className='inline text-green-500 mt-[-3px] mr-1'
              size='1.5em'
            />
            <input
              type='search'
              className='outline-none p-2 placeholder:text-xs placeholder:italic bg-slate-200 rounded text-xs'
              placeholder='Cari Nama & KTA Anggota..'
              onChange={searchHandler}
            />
          </div>
        </div>
        <DataTable
          className='w-full overflow-x-auto rounded shadow-lg'
          {...dataTableBuilder(filteredAnggota && filteredAnggota)}
        />
      </div>

      {overlayVisible && <DetailsAnggota anggota={detailsAnggota} />}
    </Layout>
  );
};

export default Anggota;
