import Layout from '../../components/Layout';
import { useEffect, useMemo, useRef, useState } from 'react';
import Select from 'react-select';
import { AiFillCaretDown, AiFillEdit, AiFillCaretRight } from 'react-icons/ai';
import {
  FaCheckCircle,
  FaTimesCircle,
  FaSave,
  FaMosque,
  FaGraduationCap,
  FaTransgender,
  FaUsers,
} from 'react-icons/fa';
import wilayahServices from '../../services/wilayah';
import { useDispatch, useSelector } from 'react-redux';
import {
  appendDemografi,
  getDemografiByProvincy,
  updateDemografi,
} from '../../reducers/demografiReducer';
import { IoSearchCircle } from 'react-icons/io5';
import sweetalert2 from '../../components/Alert';
import Modal from '../../components/Modal';
import { setModalData, setModalShow } from '../../reducers/modalReducer';

const removeClass = (target, nameClass) => {
  target?.classList.remove(nameClass);
};
const addClass = (target, nameClass) => {
  target?.classList.add(nameClass);
};

const switchClass = (target, newClass, oldClass) => {
  removeClass(target, oldClass);
  addClass(target, newClass);
};

const Demografi = () => {
  const dispatch = useDispatch();
  const modalRefs = useRef();
  const [provincy, setProvincy] = useState(null);

  useEffect(() => {
    wilayahServices
      .getDemografi('JAWA BARAT')
      .then((data) => setProvincy(data));
    dispatch(getDemografiByProvincy(32));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const RegencySelector = ({ provincy }) => {
    const selectorParentRefs = useRef();
    const [searchDistrict, setSearchDistrict] = useState(null);
    const [regency, setRegency] = useState(null);
    const [filteredRegency, setFilteredRegency] = useState(null);

    useEffect(() => {
      setFilteredRegency(regency);
    }, [regency]);

    const searchHandler = (e) => {
      const value = e.currentTarget.value;
      setSearchDistrict(value);
      if (value === '') return setFilteredRegency(regency);

      const searchedRegency = () => {
        const districts = regency.districts.filter((f) =>
          f.name.toLowerCase().includes(value.toLowerCase())
        );
        return { ...regency, districts };
      };

      return setFilteredRegency(searchedRegency());
    };

    const selectHandler = (e) => {
      const selectedRegency = provincy.regencies.find(
        (f) => f.id === Number(e.value)
      );
      setRegency(selectedRegency);
      setSearchDistrict('');
    };

    const Loader = ({ status }) => {
      const [isShown, setisShown] = useState(Boolean(status));
      useEffect(() => {
        if (Boolean(status)) {
          setisShown(!isShown);
        }
        // eslint-disable-next-line
      }, []);

      return (
        <div>
          {isShown && (
            <div className='fixed top-0 left-0 right-0 bottom-0 bg-black/50 z-[9999] grid place-items-center'>
              <div className='lds-ripple'>
                <div></div>
                <div></div>
              </div>
            </div>
          )}
        </div>
      );
    };

    const options = useMemo(() => {
      return provincy?.regencies.map((d) => {
        return { label: d.name, value: d.id };
      });
    }, [provincy]);

    return (
      <div ref={selectorParentRefs}>
        <Loader status={regency} />
        <div className='flex flex-wrap sm:justify-between gap-2 mb-4'>
          <Select
            isDisabled={!options ? true : false}
            id='kabupaten-select'
            instanceId='kabupaten-select'
            className='sm:w-4/12 w-full my-auto shadow'
            options={options}
            onChange={selectHandler}
          />
          {regency && (
            <div className='flex gap-2 p-2 sm:p-1 bg-green-500 rounded shadow sm:w-4/12 w-full'>
              <IoSearchCircle
                className='my-auto text-white mx-5'
                size='1.5em'
              />
              <input
                onChange={searchHandler}
                value={searchDistrict}
                type='search'
                placeholder='cari kecamatan..'
                className='px-2 text-sm bg-white rounded outline-none flex-grow placeholder:italic placeholder:capitalize placeholder:text-sm py-1 sm:py-0'
              />
            </div>
          )}
        </div>
        <AccordionRegency provincy={provincy} regency={filteredRegency} />
      </div>
    );
  };

  const AccordionRegency = ({ provincy, regency }) => {
    return (
      <div className='sm:columns-3 columns-1'>
        {regency?.districts.map((district) => (
          <AccordionItem
            key={district.id}
            provincy={provincy}
            regency={regency}
            district={district}
          />
        ))}
      </div>
    );
  };

  const AccordionItem = ({ provincy, regency, district }) => {
    const demografi = useSelector((state) => state.demografi);
    const [icons, setIcons] = useState(false);
    const pulldownAccordionHandler = (e) => {
      const element = e.currentTarget;
      element.nextSibling.classList.toggle('hidden');
      if (!element.nextSibling.classList.contains('hidden'))
        element.scrollIntoView();
      setIcons(!icons);
    };

    return (
      <div className='accordion break-inside-avoid'>
        <div className='py-2'>
          <div className='bg-white rounded shadow'>
            <div
              onClick={pulldownAccordionHandler}
              className='accordion-header flex justify-between cursor-pointer p-4 bg-green-100/50 hover:bg-green-100'
            >
              <div className='title flex gap-4'>
                {icons ? (
                  <AiFillCaretDown className='my-auto' />
                ) : (
                  <AiFillCaretRight className='my-auto' />
                )}
                <div className='font-bold sm:text-lg text-sm'>
                  Kec. {district.name}{' '}
                  <small className='bg-blue-400/20 py-[2px] px-3 rounded-xl shadow text-blue-400 text-xs'>
                    {demografi?.filter(
                      (f) => f.regions.district === district.id
                    ) &&
                      demografi
                        ?.filter((f) => f.regions.district === district.id)
                        .reduce((acc, obj) => acc + obj.total, 0)
                        .toLocaleString()}
                  </small>
                </div>
              </div>
              <div className='icons flex gap-2'>
                <small className='block my-auto'>
                  {
                    demografi?.filter((f) => f.regions.district === district.id)
                      .length
                  }
                  /{district.villages.length}
                </small>
                {demografi?.filter((f) => f.regions.district === district.id)
                  .length === district.villages.length ? (
                  <FaCheckCircle className='my-auto text-green-500' />
                ) : (
                  <FaTimesCircle className='my-auto text-red-500' />
                )}
              </div>
            </div>
            <div className={`accordion-body hidden`}>
              <div className='p-4'>
                <small className='block font-bold mb-2'>
                  Daftar Kelurahan:{' '}
                </small>
                {district.villages.map((village) => (
                  <div key={village.id}>
                    <FormInput
                      key={village.id}
                      region={{ provincy, regency, district, village }}
                      demografi={demografi?.find(
                        (f) => f.regions.village === village.id
                      )}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <Modal ref={modalRefs} title='Form Demografi'>
          <ModalForm />
        </Modal>
      </div>
    );
  };

  const FormInput = ({ region }) => {
    const demografi =
      useSelector((state) =>
        state.demografi.find((f) => f?.regions.village === region.village.id)
      ) || null;

    const modalHandler = () => {
      modalRefs.current?.show();
      dispatch(setModalData({ region, demografi }));
    };

    return (
      <div>
        <div className='p-2 mb-2 rounded border-l-4 border-green-400 border cursor-pointer hover:bg-slate-100 bg-slate-50'>
          <div className='grid grid-cols-4 gap-2 sm:text-base text-xs'>
            <div className='col-span-2 my-auto'>{region.village.name}</div>
            <div className='my-auto text-center'>
              <span className='font-bold'>
                {demografi?.total.toLocaleString() || 0}
              </span>
            </div>
            <div className='my-auto'>
              <button
                onClick={modalHandler}
                className='bg-blue-100 p-1 w-full rounded text-blue-500 shadow shadow-blue-200/90 hover:bg-blue-200'
              >
                <div className='flex justify-center gap-2'>
                  <AiFillEdit className='my-auto' />
                  <div>Input</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ModalForm = () => {
    const data = useSelector((s) => s.modal.data);
    const form = useRef();
    const [educations, setEducations] = useState([
      { text: 'tidak/belum sekolah', total: 0, name: 'tbs' },
      { text: 'belum tamat sd', total: 0, name: 'btsd' },
      { text: 'sd/sederajat', total: 0, name: 'sd' },
      { text: 'smp/sederajat', total: 0, name: 'smp' },
      { text: 'sma/sederajat', total: 0, name: 'sma' },
      { text: 'diploma i/ii/sederajat', total: 0, name: 'diploma' },
      { text: 'diploma iii/sederajat', total: 0, name: 'd3' },
      { text: 'diploma iv/strata i', total: 0, name: 's1' },
      { text: 'strata ii', total: 0, name: 's2' },
      { text: 'strata iii', total: 0, name: 's3' },
    ]);
    const [religions, setReligions] = useState([
      { text: 'islam', total: 0, name: 'islam' },
      { text: 'kriten', total: 0, name: 'kristen' },
      { text: 'khatolik', total: 0, name: 'khatolik' },
      { text: 'hindhu', total: 0, name: 'hindhu' },
      { text: 'buddha', total: 0, name: 'buddha' },
      { text: 'lainnya', total: 0, name: 'lainnya' },
    ]);
    const [gender, setGender] = useState([
      { text: 'pria', total: 0, name: 'pria' },
      { text: 'wanita', total: 0, name: 'wanita' },
    ]);
    const [age, setAge] = useState([
      { text: '0-4', total: 0, name: 'rangeI' },
      { text: '5-9', total: 0, name: 'rangeII' },
      { text: '10-14', total: 0, name: 'rangeIII' },
      { text: '15-19', total: 0, name: 'rangeIV' },
      { text: '20-24', total: 0, name: 'rangeV' },
      { text: '25-29', total: 0, name: 'rangeVI' },
      { text: '30-34', total: 0, name: 'rangeVII' },
      { text: '35-39', total: 0, name: 'rangeVIII' },
      { text: '40-44', total: 0, name: 'rangeIX' },
      { text: '45-49', total: 0, name: 'rangeX' },
      { text: '50-54', total: 0, name: 'rangeXI' },
      { text: '55-59', total: 0, name: 'rangeXII' },
      { text: '60-64', total: 0, name: 'rangeXIII' },
      { text: '65-69', total: 0, name: 'rangeXIV' },
      { text: '70-74', total: 0, name: 'rangeXV' },
      { text: '75+', total: 0, name: 'rangeXVI' },
    ]);
    const inputHandler = (setter, index) => {
      return (e) => {
        const target = e.target;
        const total = Number(target.value);
        if (total) switchClass(target, 'success-input', 'error-input');
        if (!total) switchClass(target, 'error-input', 'success-input');
        setter((current) => {
          return current.map((curr, i) => {
            if (i !== index) return curr;
            return { ...curr, total };
          });
        });
      };
    };
    const submitHandler = (e) => {
      e.preventDefault();
      const regions = {
        provincy: data?.region.provincy.id,
        regency: data?.region.regency.id,
        district: data?.region.district.id,
        village: data?.region.village.id,
      };

      const getTotal = (category) => {
        return category.reduce((a, b) => a + b.total, 0);
      };

      const total =
        getTotal(educations) +
        getTotal(religions) +
        getTotal(gender) +
        getTotal(age);

      const newDemografi = {
        regions,
        category: {
          gender,
          age,
          religions,
          educations,
        },
        total,
      };
      try {
        if (data.demografi) {
          console.log('update');
          dispatch(updateDemografi(newDemografi));
        } else {
          console.log('save');
          dispatch(appendDemografi(newDemografi));
        }

        modalRefs.current.close();
        sweetalert2.toast('Data berhasil disimpan');
      } catch (error) {
        console.log(error);
        sweetalert2.toast(error.toString(), false);
      }
      return;
    };

    const setterValue = (key, values) => {
      if (key === 'gender') return setGender(values);
      if (key === 'age') return setAge(values);
      if (key === 'religions') return setReligions(values);
      if (key === 'educations') return setEducations(values);
    };

    const resetValue = () => {
      setterValue('educations', [
        { text: 'tidak/belum sekolah', total: 0, name: 'tbs' },
        { text: 'belum tamat sd', total: 0, name: 'btsd' },
        { text: 'sd/sederajat', total: 0, name: 'sd' },
        { text: 'smp/sederajat', total: 0, name: 'smp' },
        { text: 'sma/sederajat', total: 0, name: 'sma' },
        { text: 'diploma i/ii/sederajat', total: 0, name: 'diploma' },
        { text: 'diploma iii/sederajat', total: 0, name: 'd3' },
        { text: 'diploma iv/strata i', total: 0, name: 's1' },
        { text: 'strata ii', total: 0, name: 's2' },
        { text: 'strata iii', total: 0, name: 's3' },
      ]);
      setterValue('gender', [
        { text: 'pria', total: 0, name: 'pria' },
        { text: 'wanita', total: 0, name: 'wanita' },
      ]);
      setterValue('religions', [
        { text: 'islam', total: 0, name: 'islam' },
        { text: 'kriten', total: 0, name: 'kristen' },
        { text: 'khatolik', total: 0, name: 'khatolik' },
        { text: 'hindhu', total: 0, name: 'hindhu' },
        { text: 'buddha', total: 0, name: 'buddha' },
        { text: 'lainnya', total: 0, name: 'lainnya' },
      ]);
      setterValue('age', [
        { text: '0-4', total: 0, name: 'rangeI' },
        { text: '5-9', total: 0, name: 'rangeII' },
        { text: '10-14', total: 0, name: 'rangeIII' },
        { text: '15-19', total: 0, name: 'rangeIV' },
        { text: '20-24', total: 0, name: 'rangeV' },
        { text: '25-29', total: 0, name: 'rangeVI' },
        { text: '30-34', total: 0, name: 'rangeVII' },
        { text: '35-39', total: 0, name: 'rangeVIII' },
        { text: '40-44', total: 0, name: 'rangeIX' },
        { text: '45-49', total: 0, name: 'rangeX' },
        { text: '50-54', total: 0, name: 'rangeXI' },
        { text: '55-59', total: 0, name: 'rangeXII' },
        { text: '60-64', total: 0, name: 'rangeXIII' },
        { text: '65-69', total: 0, name: 'rangeXIV' },
        { text: '70-74', total: 0, name: 'rangeXV' },
        { text: '75+', total: 0, name: 'rangeXVI' },
      ]);
    };

    useEffect(() => {
      if (data?.demografi) {
        for (const [key, values] of Object.entries(data.demografi.category)) {
          setterValue(key, values);
        }
      } else {
        resetValue();
      }
      // eslint-disable-next-line
    }, [data?.demografi]);

    return (
      <form onSubmit={submitHandler} ref={form}>
        <div className='cols-2'>
          <div className='cols-item'>
            <div className='card'>
              <div className='card-header bg-gradient-green flex justify-between'>
                <div className='flex gap-2'>
                  <FaMosque className='my-auto' />
                  <div className='my-auto'>Berdasarkan Agama</div>
                </div>
                <div className='bg-red-200/50 text-red-400 shadow rounded-full my-auto px-5 py-px text-xs sm:text-base'>
                  {religions
                    .reduce((a, b) => a + b.total, 0)
                    .toLocaleString() || 0}
                </div>
              </div>
              <div className='card-body'>
                {religions?.map((religion, index) => (
                  <div key={index}>
                    <div className='grid grid-cols-2 mb-2 gap-2'>
                      <span className='block font-bold uppercase sm:text-base text-xs'>
                        {religion?.text}
                      </span>
                      <input
                        type='number'
                        min='1'
                        name={religion?.name}
                        id={religion?.text}
                        value={religion?.total || ''}
                        className='input'
                        placeholder='Jumlah penduduk..'
                        onChange={inputHandler(setReligions, index)}
                        required
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className='cols-item'>
            <div className='card'>
              <div className='card-header bg-gradient-green flex justify-between'>
                <div className='flex gap-2'>
                  <FaGraduationCap className='my-auto' />
                  <div className='my-auto'>Berdasarkan Pendidikan</div>
                </div>
                <div className='bg-red-200/50 text-red-400 shadow rounded-full my-auto px-5 py-px text-xs sm:text-base'>
                  {educations
                    .reduce((a, b) => a + b.total, 0)
                    .toLocaleString() || 0}
                </div>
              </div>
              <div className='card-body'>
                {educations.map((education, index) => (
                  <div key={index} className='grid grid-cols-2 gap-2 mb-2'>
                    <div className='label my-auto'>
                      <span className='uppercase font-bold sm:text-base text-xs'>
                        {index + 1}. {education.text}
                      </span>
                    </div>
                    <input
                      type='number'
                      min='1'
                      value={education.total || ''}
                      className='input'
                      placeholder='Jumlah penduduk..'
                      name={education.name}
                      onChange={inputHandler(setEducations, index)}
                      required
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className='cols-item'>
            <div className='card'>
              <div className='card-header bg-gradient-green flex justify-between'>
                <div className='flex gap-2'>
                  <FaTransgender className='my-auto' />
                  <div className='my-auto'>Berdasarkan Gender</div>
                </div>
                <div className='bg-red-200/50 text-red-400 shadow rounded-full my-auto px-5 py-px text-xs sm:text-base'>
                  {gender.reduce((a, b) => a + b.total, 0).toLocaleString() ||
                    0}
                </div>
              </div>
              <div className='card-body'>
                <div className='grid grid-cols-2 gap-2'>
                  {gender.map((g, i) => (
                    <div key={i}>
                      <span className='block font-bold sm:text-base text-xs uppercase'>
                        {g.text}
                      </span>
                      <input
                        type='number'
                        className='input'
                        min='1'
                        placeholder='Jumlah penduduk..'
                        name={g.name}
                        value={g.total || ''}
                        onChange={inputHandler(setGender, i)}
                        required
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className='cols-item'>
            <div className='card'>
              <div className='card-header bg-gradient-green flex justify-between'>
                <div className='flex gap-2'>
                  <FaUsers className='my-auto' />
                  <div className='my-auto'>Berdasarkan Usia</div>
                </div>
                <div className='bg-red-200/50 text-red-400 shadow rounded-full my-auto px-5 py-px text-xs sm:text-base'>
                  {age.reduce((a, b) => a + b.total, 0).toLocaleString() || 0}
                </div>
              </div>
              <div className='card-body'>
                <div className='cols-2'>
                  {age?.map((a, index) => (
                    <div key={index} className='cols-item !py-0 mb-2'>
                      <div className='grid grid-cols-3 gap-2'>
                        <span className='block font-bold uppercase sm:text-base text-xs my-auto'>
                          {a?.text}
                        </span>
                        <input
                          type='number'
                          min={1}
                          name={a?.name}
                          id={a?.text}
                          value={a?.total || ''}
                          className='input col-span-2'
                          placeholder='Jumlah penduduk..'
                          onChange={inputHandler(setAge, index)}
                          required
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className='cols-item'>
            <div className='flex justify-end'>
              <button
                type='submit'
                className='flex gap-2 bg-green-200/50 text-green-400 py-2 px-5 rounded shadow-md hover:shadow-none hover:bg-green-200/80'
              >
                <FaSave className='my-auto' />
                <span className='block'>Simpan</span>
              </button>
            </div>
          </div>
        </div>
      </form>
    );
  };

  return (
    <Layout title={`Demografi`}>
      <h1 className='sm:text-lg font-bold'>Demografi Penduduk Jawa Barat</h1>
      <RegencySelector provincy={provincy} />
    </Layout>
  );
};

export default Demografi;
