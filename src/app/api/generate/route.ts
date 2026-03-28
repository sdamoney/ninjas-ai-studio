import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest } from "next/server";

const COMICAL_STYLES = [
  "Transform this person into a medieval knight posing for a royal court portrait. They should be wearing full ornate plate armor with an oversized feathered helmet plume, holding a rubber chicken instead of a sword, with a completely serious and dignified expression. The background should be a grand castle throne room. Make it look like a professional oil painting portrait.",

  "Transform this person into an 80s glam rock superstar. Give them an absolutely enormous teased hair wig with neon pink and purple streaks, heavy dramatic eye makeup with glitter, a sequined jumpsuit with massive shoulder pads, and platform boots. They should be posing dramatically with a keytar. Studio lighting with fog machine effects.",

  "Transform this person into a fancy Victorian-era aristocrat. They should be wearing an absurdly tall top hat (at least 2 feet tall), a monocle, an extremely frilly collar that goes up to their ears, and a velvet cape. They should be holding a tiny teacup with their pinky extremely extended. Painted portrait style with an ornate gold frame visible.",

  "Transform this person into a telenovela star. Give them incredibly dramatic styling — slicked back hair with too much gel (or a dramatic flowing wig), an unbuttoned silk shirt revealing a chest full of gold chains, smoldering intense eye contact, and rose petals floating around them. Dramatic sunset lighting with lens flare.",

  "Transform this person into a 1970s disco legend. Give them a massive afro wig or huge feathered hair, enormous gold-tinted sunglasses, a white three-piece polyester suit with a wide collar showing a hairy chest medallion, and platform shoes. They should be striking a Saturday Night Fever pose on a light-up disco floor.",

  "Transform this person into a stereotypical tourist on vacation. They should be wearing a Hawaiian shirt that's way too loud, cargo shorts with socks and sandals, a fanny pack, a bucket hat, multiple cameras around their neck, and holding a giant novelty foam finger. They should be taking a selfie in front of the Eiffel Tower with a goofy grin.",

  "Transform this person into a wizard from a fantasy realm. Give them a very long sparkly robe covered in moons and stars, an extremely pointy wizard hat that's slightly too big and tilts to one side, a magnificent long fake beard, and they should be dramatically casting a spell that's just producing bubbles. Mystical forest background with floating candles.",

  "Transform this person into a 1950s greaser. Give them an impossibly tall pompadour hairstyle, a leather jacket covered in unnecessary chains and patches, extremely tight rolled-up jeans, and they should be leaning against a jukebox looking too cool while holding a comically large milkshake. Retro diner setting.",

  "Transform this person into a space explorer from a low-budget sci-fi movie. They should be wearing a shiny silver spacesuit made of what looks like aluminum foil, a fishbowl-style helmet, moon boots, and they should be planting a flag on what's obviously a styrofoam moon set. Visible strings holding up cardboard stars in the background.",

  "Transform this person into a sushi chef master. They should be wearing a traditional chef headband but it's absurdly oversized, a pristine white chef coat with too many buttons, and they should be dramatically wielding an comically oversized knife while presenting a single tiny piece of sushi on an enormous plate. Intense concentration on their face. Japanese restaurant setting.",

  "Transform this person into a Renaissance painter doing a self-portrait. They should be wearing a beret and a paint-stained smock, holding a palette with wildly wrong colors, standing in front of a canvas that shows a stick-figure version of themselves. They should look extremely proud. Italian villa studio background.",

  "Transform this person into a WWE-style professional wrestler. Give them face paint, a sparkly cape, an oversized championship belt, tiny spandex shorts over tights, and knee-high boots. They should be striking an aggressive pose while flexing. Pyrotechnics and a wrestling ring in the background.",

  "Transform this person into a Bollywood superstar mid-dance number. They should be wearing an incredibly blingy sherwani covered in rhinestones and sequins, with dramatic kohl-lined eyes, perfectly styled hair blowing in a mysterious wind, and striking a dramatic dance pose with one hand raised. Dozens of backup dancers blurred in the background. Colorful stage lighting with flower petals raining down.",

  "Transform this person into a rodeo cowboy. Give them an absurdly oversized cowboy hat, a rhinestone-covered western shirt with huge fringe, an enormous belt buckle the size of a dinner plate, chaps over jeans, and cowboy boots with spurs. They should be lassoing a rubber duck. Dusty rodeo arena background.",

  "Transform this person into a French mime artist. Give them a black and white striped shirt, suspenders, a beret, white face paint with dramatic black eye makeup and drawn-on tears, white gloves, and they should be pretending to be trapped in an invisible box with an exaggerated sad expression. Parisian street background.",

  "Transform this person into a Viking warrior. Give them a huge horned helmet (historically inaccurate but iconic), a long braided beard with beads woven in, a fur cape over chainmail, and they should be dramatically holding up a turkey leg like it's Excalibur. Longship and fjord background with dramatic clouds.",

  "Transform this person into a 1920s flapper or gangster. They should be wearing a pinstripe suit with absurdly wide lapels and a fedora tilted at a dramatic angle, or a sparkly flapper dress with a massive feathered headband. They should be holding a comically oversized tommy gun (clearly a toy) or a long cigarette holder. Speakeasy background with art deco styling.",

  "Transform this person into an Egyptian pharaoh. Give them a massive gold and blue striped headdress (nemes), heavy kohl eyeliner, a fake ceremonial beard, a golden collar necklace covering their entire chest, and they should be sitting on an ornate throne holding a rubber snake scepter. Pyramid and sphinx background.",

  "Transform this person into a competitive professional gamer. They should be wearing an over-the-top gaming jersey covered in sponsor logos, a massive RGB gaming headset, fingerless gloves, energy drink cans stacked around them, and an extremely intense expression while aggressively pointing at the camera. Neon-lit gaming setup background with multiple monitors.",

  "Transform this person into a Scottish Highland warrior. Give them full blue face paint like Braveheart, a tartan kilt, a wild unkempt red wig, a fur sporran, and they should be dramatically raising a claymore sword while standing on a misty hilltop. Epic dramatic sky with bagpipers visible in the background.",

  "Transform this person into a deep sea diver from the 1800s. They should be wearing a vintage brass diving suit with the big round helmet with tiny windows, heavy boots, and they should be standing on the ocean floor surrounded by cartoon fish and a treasure chest. A tiny octopus sitting on their helmet.",

  "Transform this person into a Bollywood villain. Give them a dramatic scar (clearly drawn on), an evil goatee, a black leather outfit with unnecessary buckles and zippers, dark sunglasses pushed up on their forehead, and they should be doing an evil laugh pose. Dark warehouse with dramatic backlighting and shadows.",

  "Transform this person into a yoga guru on a mountaintop. They should be wearing flowing white robes, have an impossibly long beard, flowers in their hair, sitting in a perfect lotus position floating slightly above the ground, with a serene but slightly smug expression. Himalayan mountain peak background with clouds below them and a rainbow.",

  "Transform this person into a NASCAR driver. Give them a firesuit covered head to toe in ridiculous fake sponsor patches (things like 'Grandma's Cookies' and 'Fancy Pickles'), a helmet under their arm, aviator sunglasses, and they should be posing triumphantly next to a stock car covered in matching absurd sponsors. Race track with confetti.",

  "Transform this person into a classical orchestra conductor. They should be wearing an extremely formal tailcoat that's way too long, a massive bow tie, wild Einstein-like white hair, and they should be dramatically mid-conducting with a baton, mouth wide open in passionate expression. Full orchestra and grand concert hall background.",

  "Transform this person into a pirate captain. Give them a huge tricorn hat with an oversized feather, an eye patch, a hook hand, a parrot on their shoulder, a big curly wig, a red velvet coat with gold trim, and tall boots. They should be standing heroically on the bow of a ship with a jolly roger flag. Ocean and sunset background.",

  "Transform this person into a sumo wrestler. They should be wearing a traditional mawashi (loincloth), with their hair styled in a topknot, and they should be in the classic pre-match squat pose throwing salt with an incredibly serious expression. Traditional sumo ring (dohyo) background with referees in traditional outfits.",

  "Transform this person into a safari explorer from a 1930s adventure movie. Give them a pith helmet, khaki outfit with too many pockets, binoculars around their neck, a magnifying glass in hand, and a tiny butterfly net. They should be examining a regular house cat as if it's a rare species. African savanna background.",

  "Transform this person into a K-pop idol. Give them perfectly styled colorful hair (bright blue, pink or silver), flawless porcelain makeup, a wildly fashionable outfit mixing streetwear with high fashion — oversized jacket, chains, platform sneakers — and they should be doing a signature K-pop pose. Flashy music video set with neon lights.",

  "Transform this person into a gladiator in the Roman Colosseum. Give them bronze armor with an oversized chest plate, a red cape, a crested helmet with a ridiculous plume, shin guards, and they should be holding a trident and a tiny shield (way too small to be useful). Colosseum arena background with a cheering crowd.",

  "Transform this person into a 1990s boy band member. Give them frosted tips, a matching coordinated outfit (shiny silver or white), a choker necklace, a backwards cap or headband, and they should be doing a choreographed dance pose pointing at the camera with one hand on their heart. Studio photoshoot background with dramatic wind effect on their hair.",
];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get("image") as File | null;

    if (!imageFile) {
      return Response.json({ error: "No image provided" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return Response.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    const bytes = await imageFile.arrayBuffer();
    const base64Image = Buffer.from(bytes).toString("base64");
    const mimeType = imageFile.type || "image/jpeg";

    const style =
      COMICAL_STYLES[Math.floor(Math.random() * COMICAL_STYLES.length)];

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-3-pro-image-preview",
      generationConfig: {
        // @ts-expect-error - responseModalities is valid for image generation models
        responseModalities: ["TEXT", "IMAGE"],
      },
    });

    const prompt = `You are a professional AI photo editor. ${style}

IMPORTANT: Keep the person's face clearly recognizable — same face shape, features, and expression base. Only change their outfit, hair/wig, accessories, makeup, and surroundings. The final image should look like a high-quality professional photograph or portrait. Generate the transformed image.`;

    const result = await model.generateContent([
      {
        inlineData: {
          mimeType,
          data: base64Image,
        },
      },
      { text: prompt },
    ]);

    const response = result.response;
    const candidates = response.candidates;

    if (!candidates || candidates.length === 0) {
      return Response.json(
        { error: "No response generated. Please try again." },
        { status: 500 }
      );
    }

    for (const part of candidates[0].content.parts) {
      if (part.inlineData) {
        return Response.json({
          image: `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`,
          style: style.split(".")[0],
        });
      }
    }

    return Response.json(
      {
        error:
          "Could not generate image. The AI might need a clearer photo. Please try again.",
      },
      { status: 500 }
    );
  } catch (error) {
    console.error("Generation error:", error);
    return Response.json(
      {
        error:
          "Something went wrong during generation. Please try again with a different photo.",
      },
      { status: 500 }
    );
  }
}
