import { WeatherService } from '../page/WeatherService';

export class CommandProcessor {
  static async processCommand(userInput, settings) {
    const command = userInput.toLowerCase();

    // Date and Time
    const dateResponse = this.processDateCommand(command, userInput);
    if (dateResponse) return dateResponse;

    // Generate Image
    const imageResponse = this.processImageCommand(command);
    if (imageResponse) return imageResponse;

    // Weather
    const weatherResponse = await this.processWeatherCommand(
      command,
      userInput,
    );
    if (weatherResponse) return weatherResponse;

    // Search Location
    const locationResponse = this.processLocationCommand(command, userInput);
    if (locationResponse) return locationResponse;

    // Play Song
    const musicResponse = this.processMusicCommand(command, userInput);
    if (musicResponse) return musicResponse;

    // Search Image
    const imageSearchResponse = this.processImageSearchCommand(
      command,
      userInput,
    );
    if (imageSearchResponse) return imageSearchResponse;

    // Search Web
    const webSearchResponse = this.processWebSearchCommand(command, userInput);
    if (webSearchResponse) return webSearchResponse;

    // Open Applications
    const appResponse = this.processAppCommand(command, userInput);
    if (appResponse) return appResponse;

    // Latest News
    const newsResponse = this.processNewsCommand(command);
    if (newsResponse) return newsResponse;

    // Default AI Response
    return await this.getDefaultAIResponse(userInput);
  }

  static processDateCommand(command, userInput) {
    const dateRegex =
      /(?:what is the date|what time is it|what is the time|what is the time now|tell me the date|what is the day today|tell me the time)/i;
    if (dateRegex.test(userInput)) {
      const now = new Date();
      const dayIndex = now.getDay();
      const daysOfWeek = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ];
      const dayName = daysOfWeek[dayIndex];
      const date = now.toLocaleDateString();
      const time = now.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });

      const dateResponse = `## 📅 Current Date & Time\n\n**Day:** ${dayName}\n**Date:** ${date}\n**Time:** ${time}\n\n*Hope you're having a great ${dayName}!*`;

      return {
        type: 'text',
        content: dateResponse,
        speakText: `Today is ${dayName}, date is ${date}, and the time is ${time}`,
      };
    }
    return null;
  }

  static processImageCommand(command) {
    if (
      command.includes('generate an image') ||
      command.includes('generate image')
    ) {
      const prompt = command
        .replace(/generate an image|generate image/gi, '')
        .trim();
      const width = 512;
      const height = 512;
      const seed = Math.floor(Math.random() * 1000);
      const imageUrl = `https://pollinations.ai/p/${encodeURIComponent(
        prompt,
      )}?width=${width}&height=${height}&seed=${seed}&model=default`;

      return {
        type: 'image',
        content: imageUrl,
        speakText: `Generating image of ${prompt}, please wait...`,
      };
    }
    return null;
  }

  static async processWeatherCommand(command, userInput) {
    if (
      command.includes('weather in') ||
      command.includes('weather of') ||
      command.includes('temperature in') ||
      command.includes('temperature of')
    ) {
      const cityRegex =
        /(weather in|weather of|temperature in|temperature of)\s+([\w\s]+)/i;
      const match = userInput.match(cityRegex);

      if (match && match[2]) {
        const city = match[2].trim();
        return await WeatherService.fetchWeather(city);
      } else {
        return {
          type: 'text',
          content:
            'Please specify a city for weather information. Example: "weather in London"',
          speakText: 'Please specify a city for weather information.',
        };
      }
    }
    return null;
  }

  static processLocationCommand(command, userInput) {
    if (command.startsWith('search location')) {
      const location = command.slice(15).trim();
      if (location) {
        const mapsUrl = `https://www.google.com/maps/place/${encodeURIComponent(
          location,
        )}`;
        window.open(mapsUrl, '_blank');

        return {
          type: 'text',
          content: `## 🗺️ Location Search\n\n**Searching for:** ${location}\n\n- Opening Google Maps\n- Showing nearby places\n- Providing directions\n\n*Location search completed*`,
          speakText: `Opening Google Maps for ${location}`,
        };
      }
    }
    return null;
  }

  static processMusicCommand(command, userInput) {
    if (command.includes('play song of') || command.includes('play song')) {
      const songName = command.replace(/play song of|play song/gi, '').trim();
      const searchUrl = `https://open.spotify.com/search/${encodeURIComponent(
        songName,
      )}`;
      window.open(searchUrl, '_blank');

      return {
        type: 'text',
        content: `## 🎵 Music Player\n\n**Now Playing:** ${songName}\n\n- Opening Spotify\n- Searching for track\n- Starting playback\n\n*Enjoy your music!*`,
        speakText: `Playing ${songName} on Spotify`,
      };
    }
    return null;
  }

  static processImageSearchCommand(command, userInput) {
    if (command.startsWith('search image of')) {
      const searchQuery = command.replace('search image of', '').trim();
      const imageUrl = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(
        searchQuery,
      )}`;
      window.open(imageUrl, '_blank');

      return {
        type: 'text',
        content: `## 🖼️ Image Search\n\n**Searching for:** ${searchQuery}\n\n- Browsing image database\n- Filtering results\n- Displaying relevant images\n\n*Image search completed*`,
        speakText: `Searching images for ${searchQuery}`,
      };
    }
    return null;
  }

  static processWebSearchCommand(command, userInput) {
    if (command.startsWith('search for')) {
      const searchQuery = command.slice(10).trim();
      if (searchQuery) {
        const url = `https://www.google.com/search?q=${encodeURIComponent(
          searchQuery,
        )}`;
        window.open(url, '_blank');

        return {
          type: 'text',
          content: `## 🔍 Web Search\n\n**Searching for:** ${searchQuery}\n\n- Querying search engines\n- Analyzing results\n- Presenting information\n\n*Search completed successfully*`,
          speakText: `Searching for ${searchQuery} on Google`,
        };
      }
    }
    return null;
  }

  static processAppCommand(command, userInput) {
    if (command.includes('open ')) {
      const appName = command.split('open ')[1].trim();
      const apps = {
        notepad: 'C:\\Windows\\system32\\notepad.exe',
        calculator: 'C:\\Windows\\system32\\calc.exe',
      };

      if (apps[appName]) {
        return {
          type: 'text',
          content: `## 🚀 Application Launch\n\n**Opening:** ${appName}\n\n- Starting application\n- Loading interface\n- Ready for use\n\n*Note: This feature works in desktop applications*`,
          speakText: `I would open ${appName} in a desktop environment`,
        };
      } else {
        let site = appName;
        if (!site.startsWith('http')) {
          if (!site.startsWith('www.')) site = 'www.' + site;
          site += '.com';
        }
        window.open('http://' + site, '_blank');

        return {
          type: 'text',
          content: `## 🌐 Website Launch\n\n**Opening:** ${site}\n\n- Connecting to server\n- Loading webpage\n- Displaying content\n\n*Website loaded successfully*`,
          speakText: `Opening ${site.split('.')[1]}`,
        };
      }
    }
    return null;
  }

  static processNewsCommand(command) {
    if (
      command.includes('tell me the latest news') ||
      command.includes('latest news')
    ) {
      window.open('/news', '_blank');

      return {
        type: 'text',
        content: `## 📰 Latest News\n\n**Here are the latest news articles:**\n\n- Breaking news updates\n- Current events coverage\n- Trending stories\n\n*Opening news section...*`,
        speakText: 'Opening latest news for you',
      };
    }
    return null;
  }

  static async getDefaultAIResponse(userInput) {
    try {
      const response = await fetch(
        `https://text.pollinations.ai/${encodeURIComponent(userInput)}`,
      );
      const text = await response.text();

      return {
        type: 'text',
        content: text,
        speakText: text.replace(/[#*\-`]/g, ''),
      };
    } catch (error) {
      return {
        type: 'text',
        content:
          "I apologize, but I'm having trouble processing your request. Please try again.",
        speakText:
          "I apologize, but I'm having trouble processing your request. Please try again.",
      };
    }
  }
}
