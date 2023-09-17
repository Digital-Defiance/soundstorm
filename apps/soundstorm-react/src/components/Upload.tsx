import React, { useState, ChangeEvent, FormEvent } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { Box } from '@mui/system';
import { useAuth0 } from '@auth0/auth0-react';

const FileUploadPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [clear, setClear] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { getAccessTokenSilently } = useAuth0();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files ? event.target.files[0] : null;
    if (selectedFile && selectedFile.name === 'komplete.db3') {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    } else {
      alert('Please select a valid komplete.db3 file.');
    }
  };

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    setClear(event.target.checked);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!file) {
      alert('Please select a file before submitting.');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('clear', JSON.stringify(clear));

    try {
      const token = await getAccessTokenSilently();

      const response = await fetch('/api/sounds/upload', {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert('File uploaded successfully!');
      } else {
        alert('File upload failed.');
      }
    } catch (error) {
      console.error('There was an error uploading the file.', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>File Upload</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="fileInput">Choose a komplete.db3 file:</label>
          <input
            type="file"
            id="fileInput"
            accept=".db3"
            onChange={handleFileChange}
          />
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            This is located in your Local user profile. For example: <br />
            <pre>
              C:\Users\JessicaMulein\AppData\Local\Native Instruments\Kontakt 7
            </pre>
          </Box>
        </div>
        <div>
          <input
            type="checkbox"
            id="clearCheckbox"
            name="clear"
            checked={clear}
            onChange={handleCheckboxChange}
          />
          <label htmlFor="clearCheckbox">Replace your current sound set</label>
        </div>
        {fileName && <p>Selected file: {fileName}</p>}
        <button type="submit" disabled={loading}>
          Upload
        </button>
        {loading && <CircularProgress />}
      </form>
    </div>
  );
};

export default FileUploadPage;
