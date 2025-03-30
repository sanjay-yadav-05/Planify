import clientPromise from "./mongodb"
import { ObjectId } from "mongodb"

export async function connectToDatabase() {
  const client = await clientPromise
  const db = client.db("planify")
  return { client, db }
}

// User operations
export async function getUserByEmail(email: string) {
  const { db } = await connectToDatabase()
  return db.collection("users").findOne({ email })
}

export async function createUser(userData: any) {
  const { db } = await connectToDatabase()
  const result = await db.collection("users").insertOne(userData)
  return { ...userData, _id: result.insertedId }
}

export async function updateUser(userId: string, userData: any) {
  const { db } = await connectToDatabase()
  await db.collection("users").updateOne({ _id: new ObjectId(userId) }, { $set: userData })
  return { ...userData, _id: userId }
}

// Community operations
export async function getCommunities() {
  const { db } = await connectToDatabase()
  return db.collection("communities").find({}).toArray()
}

export async function getCommunityById(id: string) {
  const { db } = await connectToDatabase()
  return db.collection("communities").findOne({ _id: new ObjectId(id) })
}

export async function getCommunityByInviteCode(inviteCode: string) {
  const { db } = await connectToDatabase()
  return db.collection("communities").findOne({ inviteCode })
}

export async function getUserCommunities(userId: string) {
  const { db } = await connectToDatabase()
  return db
    .collection("communities")
    .find({
      $or: [{ adminId: userId }, { members: { $elemMatch: { userId } } }],
    })
    .toArray()
}

export async function createCommunity(communityData: any) {
  const { db } = await connectToDatabase()
  const result = await db.collection("communities").insertOne(communityData)
  return { ...communityData, _id: result.insertedId }
}

export async function updateCommunity(id: string, communityData: any) {
  const { db } = await connectToDatabase()
  await db.collection("communities").updateOne({ _id: new ObjectId(id) }, { $set: communityData })
  return { ...communityData, _id: id }
}

export async function addMemberToCommunity(communityId: string, memberData: any) {
  const { db } = await connectToDatabase()
  await db.collection("communities").updateOne({ _id: new ObjectId(communityId) }, { $push: { members: memberData } })
}

export async function deleteCommunity(id: string) {
  const { db } = await connectToDatabase()
  await db.collection("communities").deleteOne({ _id: new ObjectId(id) })

  // Also delete all clubs associated with this community
  await db.collection("clubs").deleteMany({ communityId: id })

  // And all events associated with those clubs
  const clubs = await db.collection("clubs").find({ communityId: id }).toArray()
  const clubIds = clubs.map((club) => club._id.toString())

  await db.collection("events").deleteMany({ clubId: { $in: clubIds } })
  await db.collection("tasks").deleteMany({ clubId: { $in: clubIds } })
}

// Club operations
export async function getClubs() {
  const { db } = await connectToDatabase()
  return db.collection("clubs").find({}).toArray()
}

export async function getClubById(id: string) {
  const { db } = await connectToDatabase()
  return db.collection("clubs").findOne({ _id: new ObjectId(id) })
}

export async function getCommunityClubs(communityId: string) {
  const { db } = await connectToDatabase()
  return db.collection("clubs").find({ communityId }).toArray()
}

export async function getUserClubs(userId: string) {
  const { db } = await connectToDatabase()
  return db
    .collection("clubs")
    .find({
      $or: [{ leadId: userId }, { members: { $elemMatch: { userId } } }],
    })
    .toArray()
}

export async function createClub(clubData: any) {
  const { db } = await connectToDatabase()
  const result = await db.collection("clubs").insertOne(clubData)
  return { ...clubData, _id: result.insertedId }
}

export async function updateClub(id: string, clubData: any) {
  const { db } = await connectToDatabase()
  await db.collection("clubs").updateOne({ _id: new ObjectId(id) }, { $set: clubData })
  return { ...clubData, _id: id }
}

export async function addMemberToClub(clubId: string, memberData: any) {
  const { db } = await connectToDatabase()
  await db.collection("clubs").updateOne({ _id: new ObjectId(clubId) }, { $push: { members: memberData } })
}

// Event operations
export async function getEvents() {
  const { db } = await connectToDatabase()
  return db.collection("events").find({}).toArray()
}

export async function getEventById(id: string) {
  const { db } = await connectToDatabase()
  return db.collection("events").findOne({ _id: new ObjectId(id) })
}

export async function getClubEvents(clubId: string) {
  const { db } = await connectToDatabase()
  return db.collection("events").find({ clubId }).toArray()
}

export async function getUserEvents(userId: string) {
  const { db } = await connectToDatabase()
  return db
    .collection("events")
    .find({
      $or: [{ organizerId: userId }, { attendees: { $elemMatch: { userId } } }],
    })
    .toArray()
}

export async function createEvent(eventData: any) {
  const { db } = await connectToDatabase()
  const result = await db.collection("events").insertOne(eventData)
  return { ...eventData, _id: result.insertedId }
}

export async function updateEvent(id: string, eventData: any) {
  const { db } = await connectToDatabase()
  await db.collection("events").updateOne({ _id: new ObjectId(id) }, { $set: eventData })
  return { ...eventData, _id: id }
}

export async function addAttendeeToEvent(eventId: string, attendeeData: any) {
  const { db } = await connectToDatabase()
  await db.collection("events").updateOne({ _id: new ObjectId(eventId) }, { $push: { attendees: attendeeData } })
}

// Task operations
export async function getTasks() {
  const { db } = await connectToDatabase()
  return db.collection("tasks").find({}).toArray()
}

export async function getTaskById(id: string) {
  const { db } = await connectToDatabase()
  return db.collection("tasks").findOne({ _id: new ObjectId(id) })
}

export async function getClubTasks(clubId: string) {
  const { db } = await connectToDatabase()
  return db.collection("tasks").find({ clubId }).toArray()
}

export async function getUserTasks(userId: string) {
  const { db } = await connectToDatabase()
  return db.collection("tasks").find({ assigneeId: userId }).toArray()
}

export async function createTask(taskData: any) {
  const { db } = await connectToDatabase()
  const result = await db.collection("tasks").insertOne(taskData)
  return { ...taskData, _id: result.insertedId }
}

export async function updateTask(id: string, taskData: any) {
  const { db } = await connectToDatabase()
  await db.collection("tasks").updateOne({ _id: new ObjectId(id) }, { $set: taskData })
  return { ...taskData, _id: id }
}

// Query operations
export async function getEventQueries(eventId: string) {
  const { db } = await connectToDatabase()
  return db.collection("queries").find({ eventId }).toArray()
}

export async function createQuery(queryData: any) {
  const { db } = await connectToDatabase()
  const result = await db.collection("queries").insertOne(queryData)
  return { ...queryData, _id: result.insertedId }
}

export async function updateQuery(id: string, queryData: any) {
  const { db } = await connectToDatabase()
  await db.collection("queries").updateOne({ _id: new ObjectId(id) }, { $set: queryData })
  return { ...queryData, _id: id }
}

