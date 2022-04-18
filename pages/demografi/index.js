import Layout from '../../components/Layout';
import { useEffect, useMemo, useRef, useState } from 'react';
import Select from 'react-select';
import { AiFillCaretDown, AiFillEdit, AiFillCaretRight } from 'react-icons/ai';
import { FaCheck, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import wilayahServices from '../../services/wilayah';
import { useDispatch, useSelector } from 'react-redux';
import {
  appendDemografi,
  getDemografiByProvincy,
  updateDemografi,
} from '../../reducers/demografiReducer';
import { IoSearchCircle, IoMan, IoWoman, IoStatsChart } from 'react-icons/io5';
import sweetalert2 from '../../components/Alert';
import { useField } from '../../hooks';
import Modal from '../../components/Modal';

const Demografi = () => {
  const [provincy, setProvincy] = useState(null);
  const demografi = useSelector((state) => state.demografi);
  const dispatch = useDispatch();
  const modalRefs = useRef();
  const [educations, setEducations] = useState([
    { text: 'tidak/belum sekolah', total: 0, value: 'tbs' },
    { text: 'belum tamat sd', total: 0, value: 'btsd' },
    { text: 'sd/sederajat', total: 0, value: 'sd' },
    { text: 'smp/sederajat', total: 0, value: 'smp' },
    { text: 'sma/sederajat', total: 0, value: 'sma' },
    { text: 'diploma i/ii/sederajat', total: 0, value: 'diploma' },
    { text: 'diploma iii/sederajat', total: 0, value: 'd3' },
    { text: 'diploma iv/strata i', total: 0, value: 's1' },
    { text: 'strata ii', total: 0, value: 's2' },
    { text: 'strata iii', total: 0, value: 's3' },
  ]);

  useEffect(() => {
    // kode provinsi jawa barat '32'
    wilayahServices.getDemografi('JAWA BARAT').then((res) => {
      setProvincy(res);
    });
    dispatch(getDemografiByProvincy(32));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const FormInput = ({ provincy, regency, district, village }) => {
    const villageCount = demografi.find(
      (f) => f.regions.village === village.id
    );

    const modalHandler = () => {
      modalRefs.current.show();
    };

    return (
      <div>
        <div className='p-2 mb-2 rounded border-l-4 border-green-400 border cursor-pointer hover:bg-slate-100 bg-slate-50'>
          <div className='grid grid-cols-4 gap-2 sm:text-base text-xs'>
            <div className='col-span-2 my-auto'>{village.name}</div>
            <div className='my-auto text-center'>
              <span className='font-bold'>
                {villageCount ? villageCount.total.toLocaleString() : 0}
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

  const AccordionRegency = ({ provincy, regency }) => {
    const AccordionItem = ({ provincy, regency, district }) => {
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
                      {demografi.filter(
                        (f) => f.regions.district === district.id
                      ) &&
                        demografi
                          .filter((f) => f.regions.district === district.id)
                          .reduce((acc, obj) => acc + obj.total, 0)
                          .toLocaleString()}
                    </small>
                  </div>
                </div>
                <div className='icons flex gap-2'>
                  <small className='block my-auto'>
                    {
                      demografi.filter((f) => f.idDistrict === district.id)
                        .length
                    }
                    /{district.villages.length}
                  </small>
                  {demografi.filter((f) => f.idDistrict === district.id)
                    .length === district.villages.length ? (
                    <FaCheckCircle className='my-auto text-green-500' />
                  ) : (
                    <FaTimesCircle className='my-auto text-red-500' />
                  )}
                </div>
              </div>
              <div className='accordion-body hidden'>
                <div className='p-4'>
                  <small className='block font-bold mb-2'>
                    Daftar Kelurahan:{' '}
                  </small>
                  {district.villages.map((village) => (
                    <FormInput
                      key={village.id}
                      provincy={provincy}
                      regency={regency}
                      district={district}
                      village={village}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    };

    return (
      <div className='sm:columns-3 columns-1'>
        {regency &&
          regency.districts.map((district) => (
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

  const RegencySelector = ({ provincy }) => {
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

    const options = useMemo(() => {
      return (
        provincy &&
        provincy.regencies.map((d) => {
          return { label: d.name, value: d.id };
        })
      );
    }, [provincy]);

    return (
      <div>
        <div className='flex flex-wrap sm:justify-between gap-2 mb-4'>
          <Select
            isDisabled={!options ? true : false}
            id='kabupaten-select'
            instanceId='kabupaten-select'
            className='sm:w-4/12 w-full my-auto shadow'
            options={options}
            onChange={(e) => {
              const selectedRegency = provincy.regencies.filter(
                (f) => f.id === e.value
              )[0];
              setRegency(selectedRegency);
              setSearchDistrict('');
            }}
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

  return (
    <Layout title={`Demografi`}>
      <h1 className='sm:text-lg font-bold'>Demografi Penduduk Jawa Barat</h1>
      <RegencySelector provincy={provincy} />
      <Modal ref={modalRefs} title='Form Demografi'>
        <div className='cols-2'>
          <div className='cols-item'>
            <div className='card'>
              <div className='card-header bg-gradient-green'>
                Berdasarkan Gender
              </div>
              <div className='card-body'>
                <div className='grid grid-cols-2 gap-2'>
                  <div>
                    <span className='block sm:text-base text-xs'>Pria</span>
                    <input
                      type='number'
                      className='input'
                      placeholder='Jumlah penduduk..'
                    />
                  </div>
                  <div>
                    <span className='block sm:text-base text-xs'>Wanita</span>
                    <input
                      type='number'
                      className='input'
                      placeholder='Jumlah penduduk..'
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='cols-item'>
            <div className='card'>
              <div className='card-header bg-gradient-green'>
                Berdasarkan Pendidikan
              </div>
              <div className='card-body'>
                {educations.map((education, index) => (
                  <div key={index} className='grid grid-cols-2 gap-2 mb-2'>
                    <div className='label my-auto'>
                      <span className='uppercase sm:text-base text-xs'>
                        {index + 1}. {education.text}
                      </span>
                    </div>
                    <input
                      type='number'
                      min='0'
                      className='input'
                      placeholder='Jumlah penduduk..'
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className='cols-item'>
            <div className='card'>
              <div className='card-header bg-gradient-green'>
                Berdasarkan Agama
              </div>
              <div className='card-body'>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint
                quae, error iste omnis repellat quisquam eum, ullam officia
                similique, corporis veritatis? Voluptatum cumque quos numquam
                sunt neque eligendi perspiciatis debitis!
              </div>
            </div>
          </div>
          <div className='cols-item'>
            <div className='card'>
              <div className='card-header bg-gradient-green'>
                Berdasarkan Usia
              </div>
              <div className='card-body'>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores
                nemo, architecto beatae itaque vitae, quod officiis voluptatem
                maxime aperiam temporibus expedita doloribus cumque illum
                aspernatur ex obcaecati consequuntur recusandae nobis nulla
                natus unde, illo cum non. Corporis fugit, molestias nostrum,
                ratione officia nobis harum dolor quidem fuga qui voluptas iste
                nemo odio eveniet, laborum doloribus! Omnis accusantium non
                dignissimos inventore ratione consequatur laborum, iste
                cupiditate quas. Ea recusandae suscipit molestiae ipsum
                obcaecati, distinctio aliquid velit ipsa. Nostrum, amet deserunt
                ratione iusto laudantium maiores vitae a minus totam fugit quam
                atque est numquam natus iure fuga quo suscipit doloribus ex
                illum.
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </Layout>
  );
};

export default Demografi;
