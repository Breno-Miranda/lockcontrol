import { Form, MetaFunction, useActionData } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import api from "~/services/api-service";


export const meta: MetaFunction = () => {
  return [
    { title: "LockControl - My password" },
    { name: "description", content: "Welcome as LockControl" },
  ];
};

export default function MyPasswords() {

  const [data, setData] = useState([]);

  const loadingData = () => {
    api.get('auth/mypass').then((response) => {
      setData(response.data.items);
    });
  }

  useEffect(() => {
    loadingData();
  }, []); 


  const [formData, setFormData] = useState({
    Application: '',
    SubApplication: '',
    Description: '',
    PasswordHash: '',
    Salt: '',
    DateInit: '',
    DateEnd: '',
  });

  const handleSubmit = async (e) => {

    e.preventDefault(); // Evita o comportamento padrão de submit do formulário

    try {
      // postData
      const response = await api.post('auth/mypass/create', {
        AuthID: 1,
        Application: formData.Application,
        SubApplication: formData.SubApplication,
        Description: formData.Description,
        PasswordHash: formData.PasswordHash,
        Salt: "S/N",
        DateInit: formData.DateInit,
        DateEnd: formData.DateEnd,
      })

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      // Resetar o formulário e atualizar os dados
      setFormData({
        Application: '',
        SubApplication: '',
        Description: '',
        PasswordHash: '',
        Salt: '',
        DateInit: '',
        DateEnd: '',
      });

      // Fechar o modal após a submissão bem-sucedida
      closeModal();

      // Atualizar os dados após a submissão bem-sucedida
      setIsDataFetched(false); // Forçar o refetch dos dados

      // atualizando lista com uma nova reuqets
      loadingData();
    } catch (error) {
      console.error('Error:', error);
      // Tratar erro de submissão do formulário
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // generateRandomPassword
  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  // openModal
  const openModal = () => {
    setFormData({ ...formData, PasswordHash: generateRandomPassword() });
    setIsModalOpen(true);
  };

  // closeModal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const [copyStatus, setCopyStatus] = useState({});

  const copyToClipboard = async (text, index) => {
    try {
      console.log('Copying:', text); // Debug log
      await navigator.clipboard.writeText(text);
      setCopyStatus((prevStatus) => ({ ...prevStatus, [index]: 'Copied!' }));
    } catch (err) {
      setCopyStatus((prevStatus) => ({ ...prevStatus, [index]: 'Failed to copy!' }));
    }
    setTimeout(() => {
      setCopyStatus((prevStatus) => ({ ...prevStatus, [index]: '' }));
    }, 2000); // Clear message after 2 seconds
  };

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">My passwords</h2>
          <p className="mt-2 text-lg leading-8 text-gray-600">
            Below is a list of your specific passwords by category.
          </p>

          <button
            className="mt-2 text-lg leading-8 text-gray-600 bg-blue-500 text-white px-4 py-2 rounded"
            onClick={openModal}
          >
            Add New Password
          </button>
        </div>
        <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-gray-200 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {data.map((items: any, index: number) => (
            <article key={index} className="flex max-w-xl flex-col items-start justify-between">
              <div className="flex items-center gap-x-4 text-xs">
                <time dateTime={items.CreatedAt} className="text-gray-500">
                  {items.CreatedAt}
                </time>
                <div
                  className="relative rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100"
                >
                  {items.Application}
                </div>
              </div>
              <div className="group relative">
                <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                  <span className="absolute" />
                  {items.SubApplication}
                </h3>
                <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">{items.Description}</p>
                <div className="mt-5 flex items-center">
                  <input
                    type="text"
                    value={items.PasswordHash}
                    readOnly
                    className="mr-2 w-full rounded border px-3 py-2 text-sm text-gray-600"
                  />
                  <button
                    type="button"
                    onClick={() => copyToClipboard(items.PasswordHash, index)}
                    className="rounded bg-blue-500 px-3 py-2 text-sm font-medium text-white hover:bg-blue-600"
                  >
                    Copy
                  </button>
                </div>
                {copyStatus[index] && (
                  <span className="text-sm text-green-500 mt-2">{copyStatus[index]}</span>
                )}
              </div>
            </article>
          ))}
        </div>

      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-xl">
            <h3 className="text-xl font-bold mb-4">Add New Password</h3>
            <Form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Application">
                  Application
                </label>
                <input
                  type="text"
                  id="Application"
                  value={formData.Application}
                  onChange={handleInputChange}
                  name="Application"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Application"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="SubApplication">
                  SubApplication
                </label>
                <input
                  type="text"
                  id="SubApplication"
                  value={formData.SubApplication}
                  onChange={handleInputChange}
                  name="SubApplication"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="SubApplication"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Description">
                  Description
                </label>
                <input
                  type="text"
                  id="Description"
                  value={formData.Description}
                  onChange={handleInputChange}
                  name="Description"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Description"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="PasswordHash">
                  Password Hash
                </label>
                <input
                  type="text"
                  id="PasswordHash"
                  value={formData.PasswordHash}
                  name="PasswordHash"
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Password Hash"
                />
                <button
                  type="button"
                  className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  onClick={() => setFormData({ ...formData, PasswordHash: generateRandomPassword() })}
                >
                  Regenerate
                </button>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="DateInit">
                  Date Init
                </label>
                <input
                  type="datetime-local"
                  id="DateInit"
                  value={formData.DateInit}
                  onChange={handleInputChange}
                  name="DateInit"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Date Init"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="DateEnd">
                  Date End
                </label>
                <input
                  type="datetime-local"
                  id="DateEnd"
                  value={formData.DateEnd}
                  onChange={handleInputChange}
                  name="DateEnd"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Date End"
                />
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Save
                </button>
                <button
                  type="button"
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  onClick={closeModal}
                >
                  Cancel
                </button>
              </div>
            </Form>
          </div>
        </div>
      )}
    </div>
  )
}
