import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { addIssue } from '../../services/dataService'
import styles from './GrievanceForm.module.css'

export default function GrievanceForm() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [location, setLocation] = useState('')
  const [category, setCategory] = useState('Solid Waste')
  const [description, setDescription] = useState('')
  const [imagePreview, setImagePreview] = useState(null)

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    addIssue({
      title,
      location,
      category,
      description,
      imagePreview,
    })

    alert('Grievance filed successfully! AI analysis triggered.')
    navigate('/citizen/track')
  }

  return (
    <div className={styles.container}>
      <div className={styles.headerCard}>
        <div className={styles.headerIcon}>📢</div>
        <div>
          <h1 className={styles.title}>Report a Civic Issue</h1>
          <p className={styles.subtitle}>
            Upload a photo to trigger automated AI classification and dispatch.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className={styles.formCard}>
        <div className={styles.formGrid}>
          <div className={styles.inputGroup}>
            <label>Issue Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Garbage pile near bus stop"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Location / Ward</label>
            <input
              type="text"
              required
              placeholder="e.g. Ward 12, Bus Stand Chowk"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label>Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="Solid Waste">Solid Waste</option>
            <option value="Plastic Waste">Plastic Waste</option>
            <option value="Construction Debris">Construction Debris</option>
            <option value="Drainage Blockage">Drainage Blockage</option>
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label>Description</label>
          <textarea
            rows="3"
            placeholder="Provide additional details..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className={styles.inputGroup}>
          <label>Upload Photo</label>
          <div className={styles.fileInputWrapper}>
            <input
              type="file"
              accept="image/*"
              className={styles.fileInput}
              onChange={handleImageUpload}
            />
          </div>
          {imagePreview && (
            <div className={styles.previewBox}>
              <img src={imagePreview} alt="Preview" className={styles.previewImage} />
            </div>
          )}
        </div>

        <button type="submit" className={styles.submitBtn}>
          🚀 Submit Grievance
        </button>
      </form>
    </div>
  )
}