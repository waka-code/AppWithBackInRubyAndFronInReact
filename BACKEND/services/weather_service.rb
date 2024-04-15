class WeatherService
    def self.insert_weather_data(data, attributes)
      weather_data = WeatherData.new(
        type: data['type'],
        external_id: attributes['external_id'],
        magnitude: attributes['magnitude'],
        place: attributes['place'],
        tsunami: attributes['tsunami'],
        mag_type: attributes['mag_type'],
        title: attributes['title'],
        coordinates: attributes['coordinates'],
        links: data['links']
      )
  
      if weather_data.valid? && weather_data.save
        return { status: 200, body: "Data inserted successfully" }
      elsif weather_data.errors[:external_id].include?("is already taken")
        return { status: 409, body: "Data with this external_id already exists" }
      else
        return { status: 500, body: "Error inserting data" }
      end
    end
  
    def self.handle_response(response)
        case response
        when Net::HTTPSuccess
          weather_data = JSON.parse(response.body)
          { status: 200, body: weather_data.to_json }
        when Net::HTTPClientError
          { status: 400, body: "Client error: #{response.message}" }
        when Net::HTTPServerError
          { status: 500, body: "Server error: #{response.message}" }
        else
          { status: 500, body: "Unknown error: #{response.message}" }
        end
      end
  
    def self.get_weather_data(page, mag_type)
     offset = (page - 1) * 10
    query = WeatherData
    query = query.where(mag_type: mag_type) if mag_type
    weather_data = query.offset(offset).limit(10)
    weather_data
    end

    def self.add_comment(external_id, comment_body)
        if comment_body.strip.empty?
          return { status: 400, body: 'Comment body cannot be empty' }
        end
    
        weather_data = WeatherData.find_by(external_id: external_id)
        if weather_data.nil?
          return { status: 404, body: 'WeatherData not found' }
        end
        comment = weather_data.comments.create(body: comment_body)
        { status: 200, body: comment }
      end
  end