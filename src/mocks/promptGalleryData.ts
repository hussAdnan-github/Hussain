export interface PromptExample {
  id: number;
  title: string;
  category: string;
  tool: string;
  image: string;
  prompt: string;
  negativePrompt: string;
  settings: string;
  tags: string[];
}

export const promptExamples: PromptExample[] = [
  {
    id: 1,
    title: "ساعة فاخرة سينمائية",
    category: "منتجات",
    tool: "Midjourney",
    image: "https://readdy.ai/api/search-image?query=luxury%20watch%20product%20photography%20cinematic%20dark%20background%20with%20dramatic%20golden%20rim%20lighting%2C%20professional%20commercial%20photography%2C%20ultra%20realistic%2C%208k%20quality%2C%20elegant%20composition%2C%20deep%20shadows%2C%20bokeh%20background&width=800&height=1000&seq=pg1&orientation=portrait",
    prompt: "A luxury Swiss watch resting on a dark obsidian surface, cinematic product photography, dramatic rim lighting with golden highlights, deep shadows, ultra-sharp details on the dial and crown, bokeh background, 8K resolution, commercial advertising style, Hasselblad medium format quality, --ar 4:5 --style raw --q 2 --s 750",
    negativePrompt: "blurry, low quality, distorted, watermark, text overlay, oversaturated, amateur, noise, grain, bad composition, deformed, extra objects, cluttered background",
    settings: "Platform: Midjourney v6\nAspect Ratio: 4:5\n--style raw\n--q 2\n--s 750",
    tags: ["منتجات", "سينمائي", "فاخر", "إضاءة درامية"]
  },
  {
    id: 2,
    title: "بورتريه سينمائي درامي",
    category: "بورتريه",
    tool: "Midjourney",
    image: "https://readdy.ai/api/search-image?query=cinematic%20portrait%20photography%20dramatic%20Rembrandt%20lighting%2C%20dark%20moody%20atmosphere%2C%20professional%20studio%20photography%2C%20sharp%20eyes%2C%20shallow%20depth%20of%20field%2C%20film%20grain%20texture%2C%20award%20winning%20portrait%2C%20ultra%20realistic&width=800&height=1000&seq=pg2&orientation=portrait",
    prompt: "Cinematic portrait of a person, dramatic Rembrandt lighting, deep shadows on one side of the face, sharp eyes with catchlights, shallow depth of field, 85mm lens, film grain texture, dark moody background, award-winning portrait photography, ultra realistic, 8K, --ar 4:5 --style raw --q 2",
    negativePrompt: "blurry eyes, overexposed, flat lighting, amateur, low quality, distorted face, extra limbs, bad anatomy, watermark",
    settings: "Platform: Midjourney v6\nAspect Ratio: 4:5\nLens: 85mm\n--style raw --q 2",
    tags: ["بورتريه", "درامي", "Rembrandt", "سينمائي"]
  },
  {
    id: 3,
    title: "مشهد فيلمي ليلي",
    category: "أفلام",
    tool: "Midjourney",
    image: "https://readdy.ai/api/search-image?query=cinematic%20night%20scene%20film%20still%2C%20neon%20lights%20reflecting%20on%20wet%20street%2C%20moody%20atmospheric%20fog%2C%20cinematic%20color%20grading%20teal%20and%20orange%2C%20professional%20cinematography%2C%20movie%20quality%2C%20ultra%20realistic%2C%20wide%20shot&width=1000&height=600&seq=pg3&orientation=landscape",
    prompt: "Cinematic night scene, wet city street reflecting neon signs, atmospheric fog, teal and orange color grading, wide establishing shot, anamorphic lens flares, film grain, movie still quality, professional cinematography, ultra realistic, 8K, inspired by Blade Runner aesthetic, --ar 16:9 --style raw --q 2 --s 800",
    negativePrompt: "daytime, bright lighting, oversaturated, amateur, low quality, distorted, watermark, text, blurry",
    settings: "Platform: Midjourney v6\nAspect Ratio: 16:9\nStyle: Cinematic\n--style raw --q 2 --s 800",
    tags: ["أفلام", "ليلي", "نيون", "سينمائي"]
  },
  {
    id: 4,
    title: "تصوير طعام فاخر",
    category: "طعام",
    tool: "DALL·E 3",
    image: "https://readdy.ai/api/search-image?query=luxury%20fine%20dining%20food%20photography%2C%20elegant%20plating%20on%20dark%20slate%2C%20dramatic%20side%20lighting%2C%20steam%20rising%2C%20professional%20food%20photography%2C%20dark%20moody%20background%2C%20ultra%20realistic%2C%20commercial%20quality%2C%20Michelin%20star%20restaurant%20style&width=800&height=1000&seq=pg4&orientation=portrait",
    prompt: "Fine dining dish on dark slate plate, elegant minimalist plating, dramatic side lighting creating depth and texture, steam rising from the food, dark moody background, professional food photography, ultra realistic, commercial advertising quality, Michelin star restaurant aesthetic, shallow depth of field, 100mm macro lens",
    negativePrompt: "messy plating, bright flat lighting, amateur, low quality, distorted food, watermark, text overlay, oversaturated",
    settings: "Platform: DALL·E 3\nStyle: Natural\nQuality: HD\nAspect Ratio: 4:5",
    tags: ["طعام", "فاخر", "Editorial", "إضاءة جانبية"]
  },
  {
    id: 5,
    title: "إعلان عطر فاخر",
    category: "منتجات",
    tool: "Midjourney",
    image: "https://readdy.ai/api/search-image?query=luxury%20perfume%20bottle%20advertisement%20photography%2C%20elegant%20glass%20bottle%20with%20golden%20cap%2C%20dark%20velvet%20background%2C%20dramatic%20spotlight%2C%20smoke%20and%20mist%20effects%2C%20ultra%20realistic%20commercial%20photography%2C%20high%20end%20fashion%20brand%2C%208k%20quality&width=800&height=1000&seq=pg5&orientation=portrait",
    prompt: "Luxury perfume bottle advertisement, elegant crystal glass bottle with gold cap, dark velvet background, dramatic spotlight from above, ethereal smoke and mist swirling around the bottle, golden light reflections, ultra realistic commercial photography, high-end fashion brand aesthetic, 8K quality, --ar 4:5 --style raw --q 2 --s 900",
    negativePrompt: "cheap looking, plastic, low quality, blurry, watermark, text, amateur, oversaturated, flat lighting",
    settings: "Platform: Midjourney v6\nAspect Ratio: 4:5\n--style raw --q 2 --s 900",
    tags: ["منتجات", "عطور", "فاخر", "دخان"]
  },
  {
    id: 6,
    title: "مشهد خيالي ملحمي",
    category: "خيالي",
    tool: "Midjourney",
    image: "https://readdy.ai/api/search-image?query=epic%20fantasy%20landscape%20AI%20generated%2C%20dramatic%20sky%20with%20storm%20clouds%2C%20ancient%20ruins%2C%20volumetric%20god%20rays%2C%20cinematic%20composition%2C%20ultra%20detailed%2C%20award%20winning%20digital%20art%2C%20dark%20fantasy%20atmosphere%2C%20professional%20concept%20art&width=1000&height=600&seq=pg6&orientation=landscape",
    prompt: "Epic fantasy landscape, ancient stone ruins on a cliff edge, dramatic storm clouds with lightning, volumetric god rays breaking through clouds, dark fantasy atmosphere, cinematic wide shot, ultra detailed environment, award-winning concept art, professional digital painting, 8K resolution, --ar 16:9 --style raw --q 2 --s 1000",
    negativePrompt: "modern elements, cars, people, low quality, blurry, watermark, text, amateur, oversaturated, flat",
    settings: "Platform: Midjourney v6\nAspect Ratio: 16:9\n--style raw --q 2 --s 1000",
    tags: ["خيالي", "ملحمي", "مناظر طبيعية", "درامي"]
  },
  {
    id: 7,
    title: "تصوير أزياء Editorial",
    category: "أزياء",
    tool: "Midjourney",
    image: "https://readdy.ai/api/search-image?query=high%20fashion%20editorial%20photography%20AI%20generated%2C%20elegant%20model%20in%20luxury%20outfit%2C%20dramatic%20studio%20lighting%2C%20dark%20background%2C%20Vogue%20magazine%20style%2C%20professional%20fashion%20photography%2C%20ultra%20realistic%2C%20cinematic%20quality&width=800&height=1000&seq=pg7&orientation=portrait",
    prompt: "High fashion editorial photography, elegant model wearing luxury designer outfit, dramatic studio lighting with deep shadows, dark seamless background, Vogue magazine aesthetic, professional fashion photography, ultra realistic, cinematic quality, 85mm lens, shallow depth of field, --ar 4:5 --style raw --q 2",
    negativePrompt: "amateur, low quality, distorted body, bad anatomy, watermark, text, oversaturated, flat lighting, casual clothing",
    settings: "Platform: Midjourney v6\nAspect Ratio: 4:5\nLens: 85mm\n--style raw --q 2",
    tags: ["أزياء", "Editorial", "Vogue", "استوديو"]
  },
  {
    id: 8,
    title: "تصوير سيارة فاخرة",
    category: "سيارات",
    tool: "Midjourney",
    image: "https://readdy.ai/api/search-image?query=luxury%20sports%20car%20photography%20cinematic%2C%20dark%20background%20with%20dramatic%20lighting%2C%20reflections%20on%20car%20body%2C%20professional%20automotive%20photography%2C%20ultra%20realistic%2C%208k%20quality%2C%20commercial%20advertising%20style%2C%20sleek%20modern%20design&width=1000&height=600&seq=pg8&orientation=landscape",
    prompt: "Luxury sports car on dark reflective surface, dramatic studio lighting highlighting the curves and lines of the body, deep shadows, chrome reflections, professional automotive photography, commercial advertising quality, ultra realistic, 8K, cinematic color grading, --ar 16:9 --style raw --q 2 --s 750",
    negativePrompt: "blurry, low quality, distorted, watermark, text, amateur, oversaturated, bad reflections, deformed car",
    settings: "Platform: Midjourney v6\nAspect Ratio: 16:9\n--style raw --q 2 --s 750",
    tags: ["سيارات", "فاخر", "سينمائي", "إعلان"]
  }
];

export const promptGalleryCategories = ["الكل", "منتجات", "بورتريه", "أفلام", "طعام", "خيالي", "أزياء", "سيارات"];
