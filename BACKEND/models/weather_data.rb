require 'mongoid'
class WeatherData
  include Mongoid::Document
  field :type, type: String, default: 'Weather'
  field :external_id, type: String
  field :magnitude, type: Float
  field :place, type: String
  field :tsunami, type: Boolean
  field :mag_type, type: String
  field :title, type: String
  field :coordinates, type: Hash
  field :links, type: Hash

  embeds_many :comments

  validates :coordinates, uniqueness: true
  validates :external_id, uniqueness: true
end

class Comment
  include Mongoid::Document
  field :body, type: String

  embedded_in :weather_data
end