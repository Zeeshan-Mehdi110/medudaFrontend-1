export const GetProductsByArtistId = async (attribute_id:string) => {
  console.log(attribute_id);
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/artist`, {
      method: 'Post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        attribute_id: attribute_id,
      }),
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('An error occurred:', error);
  }
};
